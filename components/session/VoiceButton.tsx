'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TurnState } from '@/types/session';

interface VoiceButtonProps {
  turnState: TurnState;
  isListening: boolean;
  interimTranscript: string;
  onTapToSpeak: () => void;
  onStopSpeaking: () => void;
  voiceSupported?: boolean;
  onSubmitText?: (text: string) => void;
}

type ButtonMode = 'waiting' | 'ready' | 'recording' | 'processing';

function getMode(turnState: TurnState, isListening: boolean): ButtonMode {
  if (turnState === 'processing') return 'processing';
  if (isListening) return 'recording';
  if (turnState === 'rep') return 'ready';
  return 'waiting';
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function RippleRings({ color }: { color: string }) {
  return (
    <>
      {[0, 0.5, 1].map((delay) => (
        <motion.div
          key={delay}
          className={`absolute inset-0 rounded-full border-2 ${color}`}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, delay }}
        />
      ))}
    </>
  );
}

function Spinner() {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

const modeConfig: Record<ButtonMode, { bg: string; label: string; sublabel: string }> = {
  waiting: {
    bg: 'bg-white/5',
    label: 'Prospect is speaking...',
    sublabel: '',
  },
  ready: {
    bg: 'bg-primary',
    label: 'Tap to respond',
    sublabel: 'Your turn',
  },
  recording: {
    bg: 'bg-danger',
    label: 'Listening...',
    sublabel: 'Tap to finish',
  },
  processing: {
    bg: 'bg-surface-light',
    label: 'Processing...',
    sublabel: '',
  },
};

function TextInput({ onSubmit, disabled }: { onSubmit: (text: string) => void; disabled: boolean }) {
  const [text, setText] = useState('');

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  }

  return (
    <div className="flex w-full max-w-lg items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
        disabled={disabled}
        placeholder="Type your response..."
        className="flex-1 rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-primary disabled:opacity-50"
        aria-label="Type your response"
      />
      <motion.button
        onClick={handleSubmit}
        disabled={disabled || !text.trim()}
        whileTap={{ scale: 0.95 }}
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-white transition-opacity disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        aria-label="Send response"
      >
        <SendIcon className="h-5 w-5" />
      </motion.button>
    </div>
  );
}

export function VoiceButton({
  turnState,
  isListening,
  interimTranscript,
  onTapToSpeak,
  onStopSpeaking,
  voiceSupported = true,
  onSubmitText,
}: VoiceButtonProps) {
  const mode = getMode(turnState, isListening);
  const config = modeConfig[mode];
  const disabled = mode === 'waiting' || mode === 'processing';

  if (!voiceSupported && onSubmitText) {
    const textDisabled = turnState !== 'rep';

    return (
      <div className="flex flex-col items-center gap-3">
        {turnState === 'processing' && (
          <div className="flex items-center gap-2 text-sm text-white/50">
            <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            Processing...
          </div>
        )}
        {turnState === 'prospect' && (
          <p className="text-sm text-white/50">Prospect is speaking...</p>
        )}
        {turnState === 'rep' && (
          <p className="text-sm font-medium text-accent">Your turn. Respond to the objection:</p>
        )}
        <TextInput onSubmit={onSubmitText} disabled={textDisabled} />
      </div>
    );
  }

  function handleClick() {
    if (mode === 'ready') onTapToSpeak();
    else if (mode === 'recording') onStopSpeaking();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
        {mode === 'recording' && <RippleRings color="border-danger/40" />}
        {mode === 'ready' && <RippleRings color="border-primary/25" />}
        {mode === 'processing' && <Spinner />}

        <motion.button
          onClick={handleClick}
          disabled={disabled}
          whileTap={disabled ? undefined : { scale: 0.93 }}
          whileHover={disabled ? undefined : { scale: 1.04 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className={`
            relative z-10 flex items-center justify-center
            rounded-full transition-colors duration-300
            disabled:cursor-not-allowed
            focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary
            ${config.bg}
            ${mode === 'ready' ? 'shadow-lg shadow-primary/30' : ''}
            ${mode === 'recording' ? 'shadow-lg shadow-danger/30' : ''}
          `}
          style={{ width: 80, height: 80 }}
          aria-label={config.label}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {mode === 'waiting' && (
                <div className="h-6 w-6 rounded-full border-2 border-white/20" />
              )}
              {mode === 'ready' && <MicIcon className="w-8 h-8 text-white" />}
              {mode === 'recording' && <StopIcon className="w-7 h-7 text-white" />}
              {mode === 'processing' && (
                <div className="w-6 h-6 rounded-full border-3 border-white/20 border-t-white animate-spin" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className="flex flex-col items-center gap-0.5 text-center"
        >
          <span className="text-sm font-medium text-white/70">{config.label}</span>
          {config.sublabel && (
            <span className="text-xs text-white/40">{config.sublabel}</span>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {mode === 'recording' && interimTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-sm rounded-lg bg-white/5 px-4 py-2 text-center text-sm text-white/50 italic"
          >
            &ldquo;{interimTranscript}&rdquo;
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
