'use client';

import { motion } from 'framer-motion';
import type { SessionEntry } from '@/types/session';

interface TranscriptBubbleProps {
  entry: SessionEntry;
  prospectName?: string;
}

export function TranscriptBubble({ entry, prospectName = 'Prospect' }: TranscriptBubbleProps) {
  const isProspect = entry.speaker === 'prospect';

  return (
    <motion.div
      initial={{ opacity: 0, x: isProspect ? -30 : 30, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={`flex ${isProspect ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`
          max-w-[85%] rounded-xl px-4 py-3
          ${
            isProspect
              ? 'rounded-bl-sm bg-secondary/10 border border-secondary/20'
              : 'rounded-br-sm bg-primary/10 border border-primary/20'
          }
        `}
      >
        <div className="mb-1 flex items-center gap-2">
          <span
            className={`text-xs font-semibold uppercase tracking-wider ${
              isProspect ? 'text-secondary' : 'text-primary'
            }`}
          >
            {isProspect ? prospectName : 'You'}
          </span>
          <span className="text-xs text-white/25">Round {entry.round}</span>
        </div>
        <p className="text-sm leading-relaxed text-white/85">{entry.text}</p>
      </div>
    </motion.div>
  );
}
