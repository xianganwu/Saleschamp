'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSessionStore } from '@/lib/store';
import { callFeedbackAPI } from '@/lib/session-engine';
import { ProspectAvatar } from '@/components/session/ProspectAvatar';
import { TranscriptBubble } from '@/components/session/TranscriptBubble';
import { Button } from '@/components/ui/Button';
import type { FeedbackApiResponse } from '@/types/session';

const SCORE_LABELS = [
  'Objection Acknowledgment',
  'Value Articulation',
  'Competitive Accuracy',
  'Discovery & Listening',
  'Conversation Advancement',
];

function ScoreBar({ label, score, delay }: { label: string; score: number; delay: number }) {
  const pct = (score / 5) * 100;
  const color =
    score >= 4 ? 'bg-success' : score >= 3 ? 'bg-accent' : 'bg-danger';

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 22 }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white/60">{label}</span>
        <span className="font-mono text-xs font-bold text-white/80">{score}/5</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: delay + 0.2, duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

function OverallStars({ scores }: { scores: number[] }) {
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const starCount = Math.round(avg);

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${starCount} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.div
          key={n}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 + n * 0.1, type: 'spring', stiffness: 400, damping: 18 }}
        >
          <svg
            width={28}
            height={28}
            viewBox="0 0 24 24"
            fill={n <= starCount ? '#F0AB00' : 'none'}
            stroke={n <= starCount ? '#F0AB00' : 'rgba(255,255,255,0.1)'}
            strokeWidth={1.5}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function ResultsPage() {
  const router = useRouter();
  const { scenario, persona, transcript, resetSession } = useSessionStore();

  const [feedback, setFeedback] = useState<FeedbackApiResponse | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (!scenario || transcript.length === 0) {
      router.replace('/');
    }
  }, [scenario, transcript.length, router]);

  const fetchFeedback = useCallback(async () => {
    if (transcript.length === 0 || !scenario || !persona) return;
    setFeedbackLoading(true);
    setFeedbackError(null);
    try {
      const result = await callFeedbackAPI(transcript, scenario.title, persona.id);
      setFeedback(result);
    } catch {
      setFeedbackError('Failed to load feedback. Tap retry.');
    } finally {
      setFeedbackLoading(false);
    }
  }, [transcript, scenario, persona]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleRunAgain = useCallback(() => {
    if (!scenario || !persona) return;
    const savedScenario = scenario;
    const savedPersona = persona;
    resetSession();
    useSessionStore.getState().setScenario(savedScenario);
    useSessionStore.getState().setPersona(savedPersona);
    router.push('/session');
  }, [scenario, persona, resetSession, router]);

  const handleNewScenario = useCallback(() => {
    resetSession();
    router.push('/');
  }, [resetSession, router]);

  if (!scenario) return null;

  return (
    <div className="relative min-h-dvh bg-dark">
      <main className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 px-5 py-10 sm:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Session Scorecard
          </h1>
          <p className="mt-1 text-sm text-white/40">
            {scenario.title}
          </p>
          {persona && (
            <p className="text-xs text-white/25">
              vs. {persona.name}, {persona.title}
            </p>
          )}
        </motion.div>

        {/* Stars */}
        {feedback && <OverallStars scores={feedback.scores} />}

        {/* Score breakdown */}
        {feedbackLoading && (
          <div className="flex items-center gap-2 py-4">
            <div className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <span className="text-sm text-white/40">Analyzing your performance...</span>
          </div>
        )}

        {feedbackError && (
          <div className="flex flex-col items-center gap-2 py-4">
            <p className="text-sm text-accent">{feedbackError}</p>
            <button
              onClick={fetchFeedback}
              className="rounded-lg bg-secondary/15 px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-secondary/25"
            >
              Retry
            </button>
          </div>
        )}

        {feedback && (
          <>
            {/* Score bars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full rounded-xl border border-white/5 bg-surface/60 p-5 space-y-4"
            >
              {SCORE_LABELS.map((label, i) => (
                <ScoreBar
                  key={label}
                  label={label}
                  score={feedback.scores[i] ?? 3}
                  delay={0.4 + i * 0.1}
                />
              ))}
            </motion.div>

            {/* Feedback card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="w-full rounded-xl border border-white/5 bg-surface/60 p-5 space-y-4"
            >
              {/* Strengths */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-success mb-2">
                  Strengths
                </h3>
                {feedback.strengths.map((s, i) => (
                  <p key={i} className="text-sm text-white/75 mb-1">
                    {s}
                  </p>
                ))}
              </div>

              {/* Improvement */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
                  Area to Improve
                </h3>
                <p className="text-sm text-white/75">{feedback.improvement}</p>
              </div>

              {/* Overall */}
              <div className="border-t border-white/5 pt-3">
                <p className="text-sm font-medium text-white/60">{feedback.overall}</p>
              </div>
            </motion.div>
          </>
        )}

        {/* Transcript toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full"
        >
          <button
            onClick={() => setShowTranscript((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-surface/40 px-4 py-3 text-sm text-white/50 transition-colors hover:bg-surface/60"
            aria-expanded={showTranscript}
          >
            <span>Full conversation transcript</span>
            <motion.span
              animate={{ rotate: showTranscript ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-sm"
            >
              &#x25BC;
            </motion.span>
          </button>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3 pt-4">
                  {transcript.map((entry, i) => (
                    <TranscriptBubble
                      key={i}
                      entry={entry}
                      prospectName={persona?.name}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Button large variant="primary" onClick={handleRunAgain} className="flex-1 sm:flex-none">
            Run Again
          </Button>
          <Button large variant="secondary" onClick={handleNewScenario} className="flex-1 sm:flex-none">
            New Scenario
          </Button>
        </motion.div>

        <div className="h-6" />
      </main>
    </div>
  );
}
