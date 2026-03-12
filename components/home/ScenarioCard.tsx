'use client';

import { motion } from 'framer-motion';
import type { Scenario } from '@/types/session';

interface ScenarioCardProps {
  scenario: Scenario;
  isSelected: boolean;
  onSelect: (scenario: Scenario) => void;
}

export function ScenarioCard({ scenario, isSelected, onSelect }: ScenarioCardProps) {
  return (
    <motion.button
      layout
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      onClick={() => onSelect(scenario)}
      aria-pressed={isSelected}
      className={`
        relative flex flex-col items-start gap-2
        rounded-xl bg-surface p-4 text-left
        min-h-[90px] w-full cursor-pointer
        border transition-all duration-200
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary
        ${
          isSelected
            ? 'border-primary/60 shadow-[0_0_16px_rgba(238,0,0,0.2)]'
            : 'border-white/5 hover:border-white/10 hover:bg-surface-light'
        }
      `}
    >
      <span className="text-sm font-medium leading-snug text-white/90">
        {scenario.title}
      </span>
      <span className="text-xs leading-relaxed text-white/40">
        {scenario.description}
      </span>

      {isSelected && (
        <motion.span
          layoutId="selected-scenario"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs font-bold"
          aria-hidden
        >
          &#x2713;
        </motion.span>
      )}
    </motion.button>
  );
}
