import type { Persona, PersonaId, Scenario, SessionMode } from '@/types/session';
import { SCENARIOS } from '@/lib/scenarios';
import { PERSONAS } from '@/lib/personas';
import { getModeConfig } from '@/lib/mode-config';

export interface ScenarioRecommendation {
  scenario: Scenario;
  persona: Persona;
  weakDimension: string;
  reason: string;
}

type DimensionRec = {
  scenarioId: string;
  personaId: PersonaId;
  reason: string;
};

/**
 * Objection handling dimension recommendations.
 */
const OBJECTION_RECOMMENDATIONS: DimensionRec[][] = [
  // 0 — Objection Acknowledgment
  [
    { scenarioId: 'puppet-works-fine', personaId: 'jamie_torres', reason: 'Jamie has deep investment in Puppet. Dismissing it ends the conversation -- practice acknowledging before countering.' },
    { scenarioId: 'awx-production', personaId: 'jamie_torres', reason: 'AWX is Red Hat\'s upstream. Jamie will flag any disrespect toward it -- practice validating their choice.' },
    { scenarioId: 'no-enterprise-support', personaId: 'jamie_torres', reason: 'Their self-sufficiency is a point of pride. Practice acknowledging their capability before positioning value.' },
  ],
  // 1 — Value Articulation
  [
    { scenarioId: 'cost-too-high', personaId: 'morgan_chen', reason: 'Morgan only responds to hard numbers. Practice connecting capabilities to quantified business outcomes.' },
    { scenarioId: 'cant-show-roi', personaId: 'morgan_chen', reason: 'This scenario is entirely about building a business case. Practice articulating value in ROI terms.' },
    { scenarioId: 'ansible-cli-free', personaId: 'morgan_chen', reason: 'Morgan will reject feature lists. Practice framing governance as avoided downtime cost.' },
  ],
  // 2 — Competitive Accuracy
  [
    { scenarioId: 'terraform-standard', personaId: 'jamie_torres', reason: 'Jamie is technically deep and will catch any inaccuracy about Terraform vs Ansible positioning.' },
    { scenarioId: 'cloud-native-tools', personaId: 'jamie_torres', reason: 'Practice knowing the exact boundaries of cloud-native tools without overstating Ansible\'s capabilities.' },
    { scenarioId: 'servicenow-itsm', personaId: 'morgan_chen', reason: 'Positioning AAP as complementary requires precise accuracy about what ServiceNow can and cannot do.' },
  ],
  // 3 — Discovery & Listening
  [
    { scenarioId: 'not-ready-for-platform', personaId: 'morgan_chen', reason: 'You must understand their maturity level before prescribing. Jumping to the platform pitch fails here.' },
    { scenarioId: 'security-ssh-concerns', personaId: 'sam_okafor', reason: 'Sam has precise security concerns. Practice asking targeted questions before answering.' },
    { scenarioId: 'kubernetes-native', personaId: 'jamie_torres', reason: 'Understand their K8s journey and infrastructure gaps before positioning AAP.' },
  ],
  // 4 — Conversation Advancement
  [
    { scenarioId: 'cant-show-roi', personaId: 'morgan_chen', reason: 'The whole scenario is about helping the prospect take a next step. Practice closing with actionable outcomes.' },
    { scenarioId: 'cost-too-high', personaId: 'morgan_chen', reason: 'Practice closing with TCO modeling or a scoped POC instead of just arguing the price is fair.' },
    { scenarioId: 'ansible-too-slow', personaId: 'jamie_torres', reason: 'Practice closing with an architecture review or POC to demonstrate mesh performance gains.' },
  ],
];

/**
 * Elevator pitch dimension recommendations.
 */
const PITCH_RECOMMENDATIONS: DimensionRec[][] = [
  // 0 — Hook & Opening
  [
    { scenarioId: 'pitch-cold-call', personaId: 'jamie_torres', reason: 'Jamie is skeptical of vendor calls. Practice grabbing a technical buyer\'s attention in 10 seconds.' },
    { scenarioId: 'pitch-conference-networking', personaId: 'morgan_chen', reason: 'Morgan is impatient. Practice opening with their pain, not your product.' },
  ],
  // 1 — Persona Relevance
  [
    { scenarioId: 'pitch-partner-referral', personaId: 'sam_okafor', reason: 'Sam cares about compliance specifics. Practice tailoring your pitch to a security buyer\'s priorities.' },
    { scenarioId: 'pitch-executive-briefing', personaId: 'morgan_chen', reason: 'Morgan wants strategic vision, not technical details. Practice speaking in executive language.' },
  ],
  // 2 — Clarity & Conciseness
  [
    { scenarioId: 'pitch-cold-call', personaId: 'morgan_chen', reason: 'You have 30 seconds. Practice distilling your value prop to one clear, jargon-free sentence.' },
    { scenarioId: 'pitch-conference-networking', personaId: 'jamie_torres', reason: 'Jamie is allergic to marketing speak. Practice being clear and technical without jargon.' },
  ],
  // 3 — Differentiation
  [
    { scenarioId: 'pitch-tradeshow-followup', personaId: 'jamie_torres', reason: 'They just saw a competitor demo. Practice articulating why AAP specifically, not just automation in general.' },
    { scenarioId: 'pitch-executive-briefing', personaId: 'morgan_chen', reason: 'Practice differentiating AAP from "just buying more tools" in executive terms.' },
  ],
  // 4 — Call-to-Action
  [
    { scenarioId: 'pitch-partner-referral', personaId: 'sam_okafor', reason: 'The referral opened the door. Practice proposing a concrete, low-friction next step.' },
    { scenarioId: 'pitch-tradeshow-followup', personaId: 'morgan_chen', reason: 'They are actively comparing. Practice closing with a specific comparison offer.' },
  ],
];

/**
 * Discovery call dimension recommendations.
 */
const DISCOVERY_RECOMMENDATIONS: DimensionRec[][] = [
  // 0 — Question Quality
  [
    { scenarioId: 'discovery-rhel-estate', personaId: 'morgan_chen', reason: 'Morgan gives minimal answers to bad questions. Practice asking open-ended questions that unlock real information.' },
    { scenarioId: 'discovery-terraform-evaluation', personaId: 'jamie_torres', reason: 'Jamie expects technically informed questions. Practice asking about architecture gaps, not generic pain.' },
  ],
  // 1 — Active Listening
  [
    { scenarioId: 'discovery-openshift-day2', personaId: 'jamie_torres', reason: 'Jamie reveals details incrementally. Practice building follow-up questions on what they actually said.' },
    { scenarioId: 'discovery-security-compliance', personaId: 'sam_okafor', reason: 'Sam drops compliance hints. Practice catching and following up on specific details.' },
  ],
  // 2 — Need Identification
  [
    { scenarioId: 'discovery-post-acquisition', personaId: 'morgan_chen', reason: 'The real need is unification under deadline pressure. Practice uncovering the business driver behind the tooling question.' },
    { scenarioId: 'discovery-rhel-estate', personaId: 'jamie_torres', reason: 'The surface need (automation) hides deeper pain (governance, incidents, drift). Practice digging past the surface.' },
  ],
  // 3 — Qualification Depth
  [
    { scenarioId: 'discovery-security-compliance', personaId: 'sam_okafor', reason: 'Sam has budget authority and a hard timeline. Practice uncovering budget, authority, need, and timeline.' },
    { scenarioId: 'discovery-informal-awx', personaId: 'morgan_chen', reason: 'Budget is approved and timeline is urgent. Practice qualifying the opportunity fully.' },
  ],
  // 4 — Next-Step Relevance
  [
    { scenarioId: 'discovery-terraform-evaluation', personaId: 'jamie_torres', reason: 'They are actively evaluating alternatives. Practice proposing a relevant next step based on what you learned.' },
    { scenarioId: 'discovery-openshift-day2', personaId: 'morgan_chen', reason: 'The edge expansion has a hard deadline. Practice tying your next step to their timeline.' },
  ],
];

const RECOMMENDATIONS_BY_MODE: Record<SessionMode, DimensionRec[][]> = {
  objection: OBJECTION_RECOMMENDATIONS,
  pitch: PITCH_RECOMMENDATIONS,
  discovery: DISCOVERY_RECOMMENDATIONS,
};

function findScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

function findPersona(id: PersonaId): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}

/**
 * Returns a recommended next scenario based on the rep's weakest scoring
 * dimension. Avoids recommending the scenario they just completed.
 * Recommendations stay within the same mode.
 */
export function getRecommendation(
  scores: number[],
  currentScenarioId: string,
  mode: SessionMode = 'objection',
): ScenarioRecommendation | null {
  if (scores.length < 5) return null;

  const modeConfig = getModeConfig(mode);
  const dimensionRecs = RECOMMENDATIONS_BY_MODE[mode];
  if (!dimensionRecs) return null;

  // Find the lowest-scoring dimension (first one wins ties)
  let weakestIdx = 0;
  for (let i = 1; i < 5; i++) {
    if (scores[i] < scores[weakestIdx]) {
      weakestIdx = i;
    }
  }

  const candidates = dimensionRecs[weakestIdx];
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
        weakDimension: modeConfig.scoreDimensions[weakestIdx],
        reason: candidate.reason,
      };
    }
  }

  return null;
}

export interface CrossModeRecommendation {
  targetMode: SessionMode;
  modeLabel: string;
  reason: string;
}

/**
 * Cross-mode recommendations. When a rep scores low on a dimension in one mode,
 * suggest practicing a different mode that specifically trains that skill.
 */
const CROSS_MODE_RULES: Array<{
  sourceMode: SessionMode;
  dimensionIndex: number;
  targetMode: SessionMode;
  reason: string;
}> = [
  // Low "Discovery & Listening" in objection handling → try Discovery Call
  { sourceMode: 'objection', dimensionIndex: 3, targetMode: 'discovery', reason: 'You scored low on Discovery & Listening. Try a Discovery Call session to practice asking strategic questions before pitching.' },
  // Low "Value Articulation" in objection handling → try Elevator Pitch
  { sourceMode: 'objection', dimensionIndex: 1, targetMode: 'pitch', reason: 'You scored low on Value Articulation. Try an Elevator Pitch session to practice delivering clear, concise value propositions.' },
  // Low "Clarity & Conciseness" in discovery → try Elevator Pitch
  { sourceMode: 'discovery', dimensionIndex: 0, targetMode: 'pitch', reason: 'Your questions were unfocused. Try an Elevator Pitch session to practice being concise and intentional with your words.' },
  // Low "Next-Step Relevance" in discovery → try Objection Handling
  { sourceMode: 'discovery', dimensionIndex: 4, targetMode: 'objection', reason: 'You struggled to propose relevant next steps. Try an Objection Handling session to practice advancing conversations.' },
  // Low "Persona Relevance" in pitch → try Discovery Call
  { sourceMode: 'pitch', dimensionIndex: 1, targetMode: 'discovery', reason: 'Your pitch was not tailored to the buyer. Try a Discovery Call to practice understanding what different personas care about.' },
  // Low "Hook & Opening" in pitch → try Objection Handling
  { sourceMode: 'pitch', dimensionIndex: 0, targetMode: 'objection', reason: 'Your opening did not grab attention. Try Objection Handling to practice reading and responding to prospect cues.' },
];

/**
 * Returns a cross-mode recommendation if the rep scored low in a dimension
 * that maps to a skill practiced in another mode.
 */
export function getCrossModeRecommendation(
  scores: number[],
  mode: SessionMode,
): CrossModeRecommendation | null {
  if (scores.length < 5) return null;

  // Find the lowest-scoring dimension
  let weakestIdx = 0;
  for (let i = 1; i < 5; i++) {
    if (scores[i] < scores[weakestIdx]) {
      weakestIdx = i;
    }
  }

  // Only suggest cross-mode if the score is genuinely low (3 or below)
  if (scores[weakestIdx] > 3) return null;

  const rule = CROSS_MODE_RULES.find(
    (r) => r.sourceMode === mode && r.dimensionIndex === weakestIdx,
  );
  if (!rule) return null;

  return {
    targetMode: rule.targetMode,
    modeLabel: getModeConfig(rule.targetMode).label,
    reason: rule.reason,
  };
}
