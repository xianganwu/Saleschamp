'use client';

import { motion } from 'framer-motion';
import type { SessionMode } from '@/types/session';
import { MODE_CONFIGS } from '@/lib/mode-config';

interface ModeSelectorProps {
  selectedMode: SessionMode;
  onSelectMode: (mode: SessionMode) => void;
}

const MODES: SessionMode[] = ['objection', 'pitch', 'discovery'];

export function ModeSelector({ selectedMode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="inline-flex rounded-lg border border-white/5 bg-surface/80 p-1 backdrop-blur-sm">
        {MODES.map((mode) => {
          const config = MODE_CONFIGS[mode];
          const isSelected = selectedMode === mode;
          return (
            <button
              key={mode}
              onClick={() => onSelectMode(mode)}
              className={`
                relative rounded-md px-3 py-2 text-sm font-medium transition-colors
                sm:px-4
                ${isSelected ? 'text-white' : 'text-white/40 hover:text-white/60'}
              `}
            >
              {isSelected && (
                <motion.div
                  layoutId="mode-indicator"
                  className="absolute inset-0 rounded-md bg-white/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              )}
              <span className="relative z-10">{config.label}</span>
            </button>
          );
        })}
      </div>
      <motion.p
        key={selectedMode}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="text-xs text-white/30"
      >
        {MODE_CONFIGS[selectedMode].description}
      </motion.p>
    </div>
  );
}
