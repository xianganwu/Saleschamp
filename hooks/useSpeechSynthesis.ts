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

export interface UseSpeechSynthesisReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  voicesLoaded: boolean;
  speak: (text: string, voiceConfig?: VoiceConfig) => Promise<void>;
  cancel: () => void;
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
      return new Promise((resolve, reject) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
          reject(new Error('SpeechSynthesis not supported'));
          return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = voiceConfig.pitch;
        utterance.rate = voiceConfig.rate;

        const voice = findVoice(voicesRef.current, voiceConfig.preferredVoices);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.onstart = () => setIsSpeaking(true);

        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };

        utterance.onerror = (event) => {
          setIsSpeaking(false);
          if (event.error === 'interrupted' || event.error === 'canceled') {
            resolve();
          } else {
            reject(new Error(`Speech synthesis error: ${event.error}`));
          }
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { isSupported, isSpeaking, voicesLoaded, speak, cancel };
}
