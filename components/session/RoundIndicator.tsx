'use client';

import { motion } from 'framer-motion';

interface RoundIndicatorProps {
  currentRound: number;
  maxRounds: number;
  roundLabels?: string[];
}

const DEFAULT_LABELS: Record<number, string[]> = {
  2: ['Pitch', 'Adjust'],
  3: ['Opening', 'Deep Dive', 'Close'],
  5: ['Intro', 'Explore', 'Dig Deeper', 'Clarify', 'Wrap Up'],
};

export function RoundIndicator({ currentRound, maxRounds, roundLabels }: RoundIndicatorProps) {
  const labels = roundLabels ?? DEFAULT_LABELS[maxRounds] ?? [];
  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <span className="text-sm font-semibold text-white/70">
          Round {currentRound}/{maxRounds}
        </span>
        <span className="ml-2 text-xs text-white/40">
          {labels[currentRound - 1] ?? ''}
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: maxRounds }, (_, i) => {
          const roundNum = i + 1;
          const isComplete = roundNum < currentRound;
          const isCurrent = roundNum === currentRound;

          return (
            <motion.div
              key={i}
              className={`
                h-2.5 w-2.5 rounded-full border-2
                ${
                  isComplete
                    ? 'border-success bg-success'
                    : isCurrent
                      ? 'border-accent bg-accent'
                      : 'border-white/15 bg-transparent'
                }
              `}
              animate={
                isCurrent
                  ? { scale: [1, 1.25, 1] }
                  : {}
              }
              transition={isCurrent ? { duration: 1.5, repeat: Infinity } : {}}
            />
          );
        })}
      </div>
    </div>
  );
}
