'use client';

import { useCallback, useRef, useState } from 'react';
import { useSessionStore } from '@/lib/store';
import { callSessionAPI, callFeedbackAPI } from '@/lib/session-engine';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { playSound } from '@/lib/sounds';
import type { FeedbackApiResponse, Persona, Scenario, SessionEntry, SessionMode } from '@/types/session';
import { getModeConfig } from '@/lib/mode-config';

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

function buildIntroScript(scenario: string, persona: Persona, mode: SessionMode): string {
  if (mode === 'discovery') {
    return (
      `Hi, thanks for coming in. I'm ${persona.name}, ${persona.title}. ` +
      `We've been a Red Hat customer for a while now. ` +
      `I'm curious to hear what else you think might help us. What would you like to know about our environment?`
    );
  }
  return (
    `Hi, I'm ${persona.name}, ${persona.title}. ` +
    `Thanks for taking the time today. ` +
    `So, regarding ${scenario.toLowerCase().replace(/\.$/, '')} -- ` +
    `I'd like to hear your pitch.`
  );
}

function buildPitchContextLine(scenario: Scenario, persona: Persona): string {
  return `You're meeting ${persona.name}, ${persona.title}. Scenario: ${scenario.title}. Deliver your pitch.`;
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
  // submitRef lets the silence-timeout auto-stop submit text without
  // a circular dependency between recognition and submitRepArgument.
  const submitRef = useRef<(text: string) => void>(() => {});
  const recognition = useSpeechRecognition((text) => submitRef.current(text));
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
            currentState.mode,
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
      // Stop listening if still active (covers auto-stop callback path
      // where recognition already stopped, and manual text submission)
      if (recognition.isListening) {
        recognition.stopListening();
      }

      const { scenario, persona, currentRound, mode } = useSessionStore.getState();
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
          mode,
          scenario.discoveryLayers,
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
    [store, clearError, playProspectResponse, recognition],
  );

  // Keep submitRef in sync so the silence-timeout auto-stop callback
  // always calls the latest submitRepArgument.
  submitRef.current = submitRepArgument;

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

      const mode = useSessionStore.getState().mode;
      const modeConfig = getModeConfig(mode);

      store.setScenario(scenario);
      store.setPersona(persona);

      if (modeConfig.repGoesFirst) {
        // Pitch mode: show context, then rep goes first
        const contextLine = buildPitchContextLine(scenario, persona);
        const contextEntry: SessionEntry = {
          speaker: 'prospect',
          text: contextLine,
          round: 1,
          timestamp: new Date(),
        };
        store.addTranscriptEntry(contextEntry);
        store.setTurnState('rep');
        playSound('ding');
      } else {
        // Objection / Discovery mode: prospect introduces themselves
        const intro = buildIntroScript(scenario.title, persona, mode);
        const introEntry: SessionEntry = {
          speaker: 'prospect',
          text: intro,
          round: 1,
          timestamp: new Date(),
        };
        store.addTranscriptEntry(introEntry);
        store.setTurnState('prospect');

        await synthesis.speak(intro, persona.voiceConfig);

        store.setTurnState('rep');
      }
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
