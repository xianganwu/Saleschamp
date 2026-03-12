import type { Persona, PersonaId, Scenario } from '@/types/session';
import { SCENARIOS } from '@/lib/scenarios';
import { PERSONAS } from '@/lib/personas';

export const SCORE_DIMENSION_LABELS = [
  'Objection Acknowledgment',
  'Value Articulation',
  'Competitive Accuracy',
  'Discovery & Listening',
  'Conversation Advancement',
] as const;

export interface ScenarioRecommendation {
  scenario: Scenario;
  persona: Persona;
  weakDimension: string;
  reason: string;
}

/**
 * Each scoring dimension maps to scenarios+personas that specifically
 * test and develop that skill. Multiple options per dimension so we
 * can avoid recommending the scenario the rep just completed.
 */
const DIMENSION_RECOMMENDATIONS: Array<{
  scenarioId: string;
  personaId: PersonaId;
  reason: string;
}>[] = [
  // 0 — Objection Acknowledgment
  // Scenarios where dismissing the prospect's current tool kills the conversation.
  [
    { scenarioId: 'puppet-works-fine', personaId: 'jamie_torres', reason: 'Jamie has deep investment in Puppet. Dismissing it ends the conversation -- practice acknowledging before countering.' },
    { scenarioId: 'awx-production', personaId: 'jamie_torres', reason: 'AWX is Red Hat\'s upstream. Jamie will flag any disrespect toward it -- practice validating their choice.' },
    { scenarioId: 'no-enterprise-support', personaId: 'jamie_torres', reason: 'Their self-sufficiency is a point of pride. Practice acknowledging their capability before positioning value.' },
  ],
  // 1 — Value Articulation
  // Scenarios where business outcomes matter more than features.
  [
    { scenarioId: 'cost-too-high', personaId: 'morgan_chen', reason: 'Morgan only responds to hard numbers. Practice connecting capabilities to quantified business outcomes.' },
    { scenarioId: 'cant-show-roi', personaId: 'morgan_chen', reason: 'This scenario is entirely about building a business case. Practice articulating value in ROI terms.' },
    { scenarioId: 'ansible-cli-free', personaId: 'morgan_chen', reason: 'Morgan will reject feature lists. Practice framing governance as avoided downtime cost.' },
  ],
  // 2 — Competitive Accuracy
  // Scenarios with direct competitive positioning where accuracy matters.
  [
    { scenarioId: 'terraform-standard', personaId: 'jamie_torres', reason: 'Jamie is technically deep and will catch any inaccuracy about Terraform vs Ansible positioning.' },
    { scenarioId: 'cloud-native-tools', personaId: 'jamie_torres', reason: 'Practice knowing the exact boundaries of cloud-native tools without overstating Ansible\'s capabilities.' },
    { scenarioId: 'servicenow-itsm', personaId: 'morgan_chen', reason: 'Positioning AAP as complementary requires precise accuracy about what ServiceNow can and cannot do.' },
  ],
  // 3 — Discovery & Listening
  // Scenarios where understanding the prospect's situation is critical.
  [
    { scenarioId: 'not-ready-for-platform', personaId: 'morgan_chen', reason: 'You must understand their maturity level before prescribing. Jumping to the platform pitch fails here.' },
    { scenarioId: 'security-ssh-concerns', personaId: 'sam_okafor', reason: 'Sam has precise security concerns. Practice asking targeted questions before answering.' },
    { scenarioId: 'kubernetes-native', personaId: 'jamie_torres', reason: 'Understand their K8s journey and infrastructure gaps before positioning AAP.' },
  ],
  // 4 — Conversation Advancement
  // Scenarios where moving to a concrete next step is essential.
  [
    { scenarioId: 'cant-show-roi', personaId: 'morgan_chen', reason: 'The whole scenario is about helping the prospect take a next step. Practice closing with actionable outcomes.' },
    { scenarioId: 'cost-too-high', personaId: 'morgan_chen', reason: 'Practice closing with TCO modeling or a scoped POC instead of just arguing the price is fair.' },
    { scenarioId: 'ansible-too-slow', personaId: 'jamie_torres', reason: 'Practice closing with an architecture review or POC to demonstrate mesh performance gains.' },
  ],
];

function findScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

function findPersona(id: PersonaId): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}

/**
 * Returns a recommended next scenario based on the rep's weakest scoring
 * dimension. Avoids recommending the scenario they just completed.
 */
export function getRecommendation(
  scores: number[],
  currentScenarioId: string,
): ScenarioRecommendation | null {
  if (scores.length < 5) return null;

  // Find the lowest-scoring dimension (first one wins ties)
  let weakestIdx = 0;
  for (let i = 1; i < 5; i++) {
    if (scores[i] < scores[weakestIdx]) {
      weakestIdx = i;
    }
  }

  const candidates = DIMENSION_RECOMMENDATIONS[weakestIdx];
  if (!candidates) return null;

  // Pick the first candidate that isn't the current scenario
  for (const candidate of candidates) {
    if (candidate.scenarioId === currentScenarioId) continue;
    const scenario = findScenario(candidate.scenarioId);
    const persona = findPersona(candidate.personaId);
    if (scenario && persona) {
      return {
        scenario,
        persona,
        weakDimension: SCORE_DIMENSION_LABELS[weakestIdx],
        reason: candidate.reason,
      };
    }
  }

  return null;
}
