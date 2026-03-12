'use client';

import { motion } from 'framer-motion';
import type { Persona } from '@/types/session';
import { PERSONAS } from '@/lib/personas';

interface PersonaSelectorProps {
  selectedPersona: Persona | null;
  onSelectPersona: (persona: Persona) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function PersonaSelector({ selectedPersona, onSelectPersona }: PersonaSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-base font-semibold text-center text-white/80">
        Choose your prospect
      </h2>

      <div className="flex flex-col gap-2">
        {PERSONAS.map((persona) => {
          const isSelected = selectedPersona?.id === persona.id;
          return (
            <motion.button
              key={persona.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              onClick={() => onSelectPersona(persona)}
              aria-pressed={isSelected}
              className={`
                flex items-center gap-3 rounded-xl border p-3 text-left
                transition-all duration-200
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary
                ${
                  isSelected
                    ? 'border-secondary/50 bg-secondary/10'
                    : 'border-white/5 bg-surface hover:border-white/10 hover:bg-surface-light'
                }
              `}
            >
              {/* Avatar */}
              <div
                className={`
                  flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full
                  text-xs font-bold
                  ${isSelected ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-white/50'}
                `}
              >
                {getInitials(persona.name)}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white/80'}`}>
                    {persona.name}
                  </span>
                  <span className="text-xs text-white/35">{persona.title}</span>
                </div>
                <p className="text-xs text-white/40 truncate">
                  {persona.style}
                </p>
              </div>

              {/* Check */}
              {isSelected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-white text-xs"
                  aria-hidden
                >
                  &#x2713;
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-xs text-white/30">
        Each persona has different priorities and communication style.
      </p>
    </motion.div>
  );
}
