'use client';

import { useCallback, useRef, useState } from 'react';
import { useSessionStore } from '@/lib/store';
import { callSessionAPI, callFeedbackAPI } from '@/lib/session-engine';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { playSound } from '@/lib/sounds';
import type { FeedbackApiResponse, Persona, Scenario, SessionEntry } from '@/types/session';

function toUserFriendlyError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  console.error('Session error:', raw);
  if (raw.includes('API key') || raw.includes('configuration'))
    return 'Connection error -- check server configuration.';
  if (raw.includes('fetch') || raw.includes('network') || raw.includes('Failed'))
    return 'Network error. Check your connection and try again.';
  if (raw.includes('timeout') || raw.includes('Timeout'))
    return 'Request timed out. Try again.';
  return 'Something went wrong. Try again.';
}

function buildIntroScript(scenario: string, persona: Persona): string {
  return (
    `Hi, I'm ${persona.name}, ${persona.title}. ` +
    `Thanks for taking the time today. ` +
    `So, regarding ${scenario.toLowerCase().replace(/\.$/, '')} -- ` +
    `I'd like to hear your pitch.`
  );
}

export interface UseSessionReturn {
  isListening: boolean;
  isSpeaking: boolean;
  voiceSupported: boolean;
  interimTranscript: string;

  scenario: Scenario | null;
  persona: Persona | null;
  currentRound: number;
  turnState: ReturnType<typeof useSessionStore.getState>['turnState'];
  transcript: readonly SessionEntry[];

  error: string | null;
  feedback: FeedbackApiResponse | null;

  startSession: (scenario: Scenario, persona: Persona) => Promise<void>;
  startRepTurn: () => void;
  finishRepTurn: () => void;
  submitTextArgument: (text: string) => void;
  resetSession: () => void;
  testAudio: () => Promise<import('@/hooks/useSpeechSynthesis').AudioTestResult>;
}

export function useSession(): UseSessionReturn {
  const store = useSessionStore();
  const recognition = useSpeechRecognition();
  const synthesis = useSpeechSynthesis();

  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackApiResponse | null>(null);

  const processingRef = useRef(false);

  const clearError = useCallback(() => setError(null), []);

  const playProspectResponse = useCallback(
    async (text: string, isComplete: boolean) => {
      store.setTurnState('prospect');

      const persona = useSessionStore.getState().persona;

      try {
        await synthesis.speak(text, persona?.voiceConfig);
      } catch (err) {
        console.error('TTS playback failed:', err);
      }

      if (isComplete) {
        store.setTurnState('processing');

        const currentState = useSessionStore.getState();
        try {
          const result = await callFeedbackAPI(
            currentState.transcript,
            currentState.scenario?.title ?? '',
            currentState.persona?.id ?? 'morgan_chen',
          );
          setFeedback(result);
        } catch (err) {
          setError(toUserFriendlyError(err));
        }

        store.setTurnState('feedback');
      } else {
        store.advanceRound();
        store.setTurnState('rep');
        playSound('ding');
      }
    },
    [synthesis, store],
  );

  const submitRepArgument = useCallback(
    async (text: string) => {
      if (processingRef.current) return;
      processingRef.current = true;
      clearError();

      const { scenario, persona, currentRound } = useSessionStore.getState();
      if (!scenario || !persona) {
        processingRef.current = false;
        return;
      }

      const repEntry: SessionEntry = {
        speaker: 'rep',
        text,
        round: currentRound,
        timestamp: new Date(),
      };
      store.addTranscriptEntry(repEntry);
      store.setTurnState('processing');

      try {
        const currentTranscript = useSessionStore.getState().transcript;
        const result = await callSessionAPI(
          currentTranscript,
          scenario.title,
          scenario.context,
          persona.id,
          currentRound,
        );

        const prospectEntry: SessionEntry = {
          speaker: 'prospect',
          text: result.response,
          round: currentRound,
          timestamp: new Date(),
        };
        store.addTranscriptEntry(prospectEntry);

        playSound('whoosh');
        await playProspectResponse(result.response, result.isComplete);
      } catch (err) {
        setError(toUserFriendlyError(err));
        store.setTurnState('rep');
      } finally {
        processingRef.current = false;
      }
    },
    [store, clearError, playProspectResponse],
  );

  const startRepTurn = useCallback(() => {
    if (store.turnState !== 'rep') return;
    clearError();
    recognition.startListening();
  }, [store.turnState, recognition, clearError]);

  const finishRepTurn = useCallback(() => {
    const finalText = recognition.stopListening();
    if (!finalText.trim()) return;
    submitRepArgument(finalText.trim());
  }, [recognition, submitRepArgument]);

  const submitTextArgument = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      submitRepArgument(trimmed);
    },
    [submitRepArgument],
  );

  const startSession = useCallback(
    async (scenario: Scenario, persona: Persona) => {
      store.resetSession();
      setFeedback(null);
      clearError();

      store.setScenario(scenario);
      store.setPersona(persona);

      const intro = buildIntroScript(scenario.title, persona);

      store.setTurnState('prospect');

      try {
        await synthesis.speak(intro, persona.voiceConfig);
      } catch (err) {
        console.error('Intro TTS failed:', err);
        setError('Audio playback failed. Check your browser supports speech synthesis.');
      }

      store.setTurnState('rep');
    },
    [store, synthesis, clearError],
  );

  const resetSession = useCallback(() => {
    recognition.reset();
    synthesis.cancel();
    store.resetSession();
    setFeedback(null);
    clearError();
  }, [recognition, synthesis, store, clearError]);

  return {
    isListening: recognition.isListening,
    isSpeaking: synthesis.isSpeaking,
    voiceSupported: recognition.isSupported && synthesis.isSupported,
    interimTranscript: recognition.transcript,

    scenario: store.scenario,
    persona: store.persona,
    currentRound: store.currentRound,
    turnState: store.turnState,
    transcript: store.transcript,

    error,
    feedback,

    startSession,
    startRepTurn,
    finishRepTurn,
    submitTextArgument,
    resetSession,
    testAudio: synthesis.testAudio,
  };
}
