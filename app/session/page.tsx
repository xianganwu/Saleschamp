'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { ProspectAvatar } from '@/components/session/ProspectAvatar';
import { VoiceButton } from '@/components/session/VoiceButton';
import { TranscriptBubble } from '@/components/session/TranscriptBubble';
import { RoundIndicator } from '@/components/session/RoundIndicator';
import { Button } from '@/components/ui/Button';

function getProspectState(turnState: string, isSpeaking: boolean) {
  if (turnState === 'prospect' && isSpeaking) return 'speaking' as const;
  if (turnState === 'processing') return 'thinking' as const;
  return 'idle' as const;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function SessionPage() {
  const router = useRouter();
  const session = useSession();
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const [compatDismissed, setCompatDismissed] = useState(false);

  useEffect(() => {
    if (!session.scenario && !initRef.current) {
      router.replace('/');
    }
  }, [session.scenario, router]);

  useEffect(() => {
    if (session.scenario && session.persona && !initRef.current) {
      initRef.current = true;
      session.startSession(session.scenario, session.persona);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.transcript.length]);

  if (!session.scenario || !session.persona) {
    return null;
  }

  const prospectState = getProspectState(session.turnState, session.isSpeaking);
  const isComplete = session.turnState === 'feedback';

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-dark">
      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between border-b border-white/5 bg-surface/60 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-white/80 sm:text-base">
            {session.scenario.title}
          </h1>
          <p className="text-xs text-white/35">
            vs. <span className="text-secondary">{session.persona.name}</span>
            <span className="ml-1 text-white/20">{session.persona.title}</span>
          </p>
        </div>
        <RoundIndicator currentRound={session.currentRound} maxRounds={3} />
      </header>

      {/* Main arena */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Prospect section */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3 sm:px-6">
          <ProspectAvatar
            state={prospectState}
            size={48}
            initials={getInitials(session.persona.name)}
            name={session.persona.name}
          />
          <AnimatePresence mode="wait">
            <motion.span
              key={prospectState}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              className="text-xs text-white/40"
            >
              {prospectState === 'speaking'
                ? `${session.persona.name} is responding...`
                : prospectState === 'thinking'
                  ? 'Processing...'
                  : `${session.persona.name}, ${session.persona.title}`}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Browser compat banner */}
        {!session.voiceSupported && !compatDismissed && (
          <div className="mx-4 mt-2 flex items-center gap-2 rounded-lg border border-accent/15 bg-accent/5 px-4 py-2 text-xs text-accent sm:mx-6">
            <span className="flex-1">Voice unavailable in this browser -- type responses instead.</span>
            <button
              onClick={() => setCompatDismissed(true)}
              className="flex-shrink-0 text-accent/40 hover:text-accent"
              aria-label="Dismiss"
            >
              &#x2715;
            </button>
          </div>
        )}

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {session.transcript.map((entry, i) => (
              <TranscriptBubble
                key={i}
                entry={entry}
                prospectName={session.persona?.name}
              />
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {session.transcript.length === 0 && session.turnState === 'rep' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center text-sm text-white/25"
            >
              Respond to the prospect&apos;s objection.
            </motion.p>
          )}
        </div>

        {/* Error toast */}
        <AnimatePresence>
          {session.error && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="mx-auto mb-2 max-w-sm rounded-lg bg-danger/15 border border-danger/25 px-4 py-2 text-center text-sm text-danger"
            >
              {session.error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 border-t border-white/5 bg-surface/60 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto max-w-md">
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <p className="text-base font-semibold text-accent">
                  Session complete
                </p>
                <Button
                  large
                  variant="primary"
                  onClick={() => router.push('/results')}
                >
                  See Your Scorecard
                </Button>
              </motion.div>
            ) : (
              <motion.div key="voice" layout>
                <VoiceButton
                  turnState={session.turnState}
                  isListening={session.isListening}
                  interimTranscript={session.interimTranscript}
                  onTapToSpeak={session.startRepTurn}
                  onStopSpeaking={session.finishRepTurn}
                  voiceSupported={session.voiceSupported}
                  onSubmitText={session.submitTextArgument}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
