'use client';

import { motion } from 'framer-motion';
import type { Scenario, ScenarioCategory } from '@/types/session';
import { SCENARIOS, CATEGORY_LABELS } from '@/lib/scenarios';
import { ScenarioCard } from '@/components/home/ScenarioCard';

interface ScenarioGridProps {
  selectedScenario: Scenario | null;
  onSelectScenario: (scenario: Scenario) => void;
}

const CATEGORY_ORDER: ScenarioCategory[] = ['upstream', 'competitive', 'value', 'technical'];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 26 },
  },
};

export function ScenarioGrid({ selectedScenario, onSelectScenario }: ScenarioGridProps) {
  const scenariosByCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    scenarios: SCENARIOS.filter((s) => s.category === cat),
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8"
    >
      {scenariosByCategory.map((group) => (
        <div key={group.category}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/40">
            {group.label}
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.scenarios.map((scenario) => (
              <motion.div key={scenario.id} variants={cardVariants}>
                <ScenarioCard
                  scenario={scenario}
                  isSelected={selectedScenario?.id === scenario.id}
                  onSelect={onSelectScenario}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
