'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import type { VoiceConfig } from '@/types/session';

const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  pitch: 1.0,
  rate: 1.0,
  preferredVoices: ['Google US English', 'Microsoft David'],
};

function findVoice(
  voices: SpeechSynthesisVoice[],
  preferred: readonly string[],
): SpeechSynthesisVoice | undefined {
  for (const name of preferred) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) return match;
  }
  const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
  if (anyEnglish) return anyEnglish;
  return voices[0];
}

function splitIntoSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  // Split on sentence-ending punctuation followed by whitespace.
  // Uses capture group instead of lookbehind for browser compatibility.
  const parts = trimmed.split(/([.!?])\s+/);
  const sentences: string[] = [];
  for (let i = 0; i < parts.length; i += 2) {
    const sentence = parts[i] + (parts[i + 1] || '');
    if (sentence.trim()) sentences.push(sentence.trim());
  }
  return sentences.length > 0 ? sentences : [trimmed];
}

export interface AudioTestResult {
  supported: boolean;
  voiceCount: number;
  voiceNames: string[];
  testPassed: boolean;
  error?: string;
}

export interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  voicesLoaded: boolean;
  speak: (text: string, voiceConfig?: VoiceConfig) => Promise<void>;
  cancel: () => void;
  testAudio: () => Promise<AudioTestResult>;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSupported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window,
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        voicesRef.current = voices;
        setVoicesLoaded(true);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  const cancel = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, voiceConfig: VoiceConfig = DEFAULT_VOICE_CONFIG): Promise<void> => {
      return new Promise((resolve) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
          console.warn('[TTS] speechSynthesis not supported');
          resolve();
          return;
        }

        const wasSpeaking = window.speechSynthesis.speaking;
        window.speechSynthesis.cancel();

        const sentences = splitIntoSentences(text);
        if (sentences.length === 0) {
          resolve();
          return;
        }

        // Ensure voices are loaded before speaking
        if (voicesRef.current.length === 0) {
          const fresh = window.speechSynthesis.getVoices();
          if (fresh.length > 0) voicesRef.current = fresh;
        }

        const voice = findVoice(voicesRef.current, voiceConfig.preferredVoices);
        let currentIndex = 0;
        let settled = false;

        // Chrome/macOS keepalive: periodically pause/resume to prevent
        // the TTS engine from hanging (known Chrome bug where onend never fires).
        const keepAlive = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(keepAlive);
            return;
          }
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }, 3_000);

        const finish = () => {
          if (settled) return;
          settled = true;
          clearInterval(keepAlive);
          setIsSpeaking(false);
          window.speechSynthesis.cancel();
          resolve();
        };

        // Overall timeout: never let TTS hang the session
        const totalTimeout = setTimeout(() => {
          console.warn('[TTS] Global timeout — speech hung, continuing session');
          finish();
        }, 15_000);

        const speakNext = () => {
          if (settled) return;
          if (currentIndex >= sentences.length) {
            clearTimeout(totalTimeout);
            finish();
            return;
          }

          const utterance = new SpeechSynthesisUtterance(sentences[currentIndex]);
          utterance.pitch = voiceConfig.pitch;
          utterance.rate = voiceConfig.rate;

          if (voice) {
            utterance.voice = voice;
          }

          if (currentIndex === 0) {
            utterance.onstart = () => setIsSpeaking(true);
          }

          // Per-sentence timeout: if a sentence hangs, skip it
          const sentenceTimeout = setTimeout(() => {
            console.warn(`[TTS] Sentence timeout (index ${currentIndex}), skipping`);
            currentIndex++;
            speakNext();
          }, 8_000);

          utterance.onend = () => {
            clearTimeout(sentenceTimeout);
            currentIndex++;
            speakNext();
          };

          utterance.onerror = (event) => {
            clearTimeout(sentenceTimeout);
            console.warn(`[TTS] Utterance error: ${event.error}`);
            if (event.error === 'interrupted' || event.error === 'canceled') {
              clearTimeout(totalTimeout);
              finish();
            } else {
              // Skip this sentence and try the next
              currentIndex++;
              speakNext();
            }
          };

          window.speechSynthesis.speak(utterance);
        };

        // Only delay if we actually canceled ongoing speech (Chrome race
        // condition). Otherwise run immediately to preserve user gesture context.
        if (wasSpeaking) {
          setTimeout(speakNext, 50);
        } else {
          speakNext();
        }
      });
    },
    [],
  );

  const testAudio = useCallback(async (): Promise<AudioTestResult> => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return { supported: false, voiceCount: 0, voiceNames: [], testPassed: false, error: 'speechSynthesis not available' };
    }

    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const voiceNames = voices.map((v) => v.name);
    const result: AudioTestResult = {
      supported: true,
      voiceCount: voices.length,
      voiceNames: voiceNames.slice(0, 10),
      testPassed: false,
    };

    if (voices.length === 0) {
      result.error = 'No voices available';
      return result;
    }

    // Pick an explicit English voice (macOS default voice can hang in Chrome)
    const voice = findVoice(voices, ['Samantha', 'Alex', 'Daniel']);

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        clearInterval(keepAlive);
        window.speechSynthesis.cancel();
        result.error = 'Speech timed out — no onend fired';
        resolve(result);
      }, 5_000);

      const utterance = new SpeechSynthesisUtterance('Testing audio. Can you hear this?');
      utterance.volume = 1;
      if (voice) utterance.voice = voice;

      // Chrome keepalive workaround
      const keepAlive = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(keepAlive);
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 1_000);

      utterance.onend = () => {
        clearTimeout(timeout);
        clearInterval(keepAlive);
        result.testPassed = true;
        resolve(result);
      };
      utterance.onerror = (event) => {
        clearTimeout(timeout);
        clearInterval(keepAlive);
        result.error = `Speech error: ${event.error}`;
        resolve(result);
      };
      window.speechSynthesis.speak(utterance);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { isSupported, isSpeaking, voicesLoaded, speak, cancel, testAudio };
}
