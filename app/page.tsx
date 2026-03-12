'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ScenarioGrid } from '@/components/home/ScenarioGrid';
import { PersonaSelector } from '@/components/home/PersonaSelector';
import { Button } from '@/components/ui/Button';
import { useSessionStore } from '@/lib/store';
import type { Persona, Scenario } from '@/types/session';

export default function HomePage() {
  const router = useRouter();
  const { setScenario, setPersona } = useSessionStore();

  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [voiceSupported] = useState(
    () =>
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window),
  );
  const [compatDismissed, setCompatDismissed] = useState(false);

  const canStart = selectedScenario !== null && selectedPersona !== null;

  function handleStart() {
    if (!selectedScenario || !selectedPersona) return;
    setScenario(selectedScenario);
    setPersona(selectedPersona);
    router.push('/session');
  }

  return (
    <div className="relative min-h-screen">
      <main className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-5 py-10 sm:py-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Sales<span className="text-primary">Champ</span>
          </h1>
          <p className="max-w-lg text-sm text-white/40">
            Practice handling real AAP objections against AI-simulated prospects.
            Choose a scenario, pick a prospect persona, and sharpen your pitch.
          </p>
        </motion.div>

        {/* Browser compat banner */}
        {!voiceSupported && !compatDismissed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="w-full max-w-md"
          >
            <div className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3 text-sm text-accent">
              <span className="flex-1">
                Voice input is not available in this browser. You can type responses instead.
                For voice support, use Chrome or Edge.
              </span>
              <button
                onClick={() => setCompatDismissed(true)}
                className="mt-0.5 flex-shrink-0 text-accent/50 hover:text-accent"
                aria-label="Dismiss"
              >
                &#x2715;
              </button>
            </div>
          </motion.div>
        )}

        {/* Scenario Grid */}
        <section className="w-full" aria-label="Choose a competitive scenario">
          <ScenarioGrid
            selectedScenario={selectedScenario}
            onSelectScenario={(scenario) => {
              setSelectedScenario(scenario);
              setSelectedPersona(null);
            }}
          />
        </section>

        {/* Persona Selector */}
        <AnimatePresence>
          {selectedScenario && (
            <motion.section
              key="persona-selector"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="w-full max-w-md overflow-hidden"
              aria-label="Choose prospect persona"
            >
              <div className="rounded-xl border border-white/5 bg-surface/80 p-5 backdrop-blur-sm">
                <p className="mb-3 text-center text-xs font-medium text-white/40">
                  {selectedScenario.title}
                </p>
                <PersonaSelector
                  selectedPersona={selectedPersona}
                  onSelectPersona={setSelectedPersona}
                />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Start CTA */}
        <AnimatePresence>
          {canStart && (
            <motion.div
              key="start-btn"
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <Button large variant="primary" onClick={handleStart}>
                Start Session
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-8" />
      </main>
    </div>
  );
}
