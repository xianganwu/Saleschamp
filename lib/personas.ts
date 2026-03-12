import type { Persona } from '@/types/session';

export const PERSONAS: readonly Persona[] = [
  {
    id: 'morgan_chen',
    name: 'Morgan Chen',
    title: 'VP of Infrastructure',
    role: 'Budget holder, reports to CIO',
    style: 'Data-driven, bottom-line focused, slightly impatient',
    hotButtons: 'Cost, ROI, headcount efficiency, risk to uptime',
    convincedBy: 'Hard numbers, TCO comparisons, customer case studies with quantified outcomes, risk framing',
    voiceConfig: {
      pitch: 0.95,
      rate: 1.1,
      preferredVoices: ['Google US English', 'Microsoft Mark'],
    },
  },
  {
    id: 'jamie_torres',
    name: 'Jamie Torres',
    title: 'Senior Platform Engineer',
    role: 'Technical evaluator, open source contributor',
    style: 'Technically deep, community-oriented, allergic to marketing speak',
    hotButtons: 'Technical merit, open source integrity, engineering velocity, no vendor lock-in',
    convincedBy: 'Honest technical differentiation, upstream contribution record, architecture specifics',
    voiceConfig: {
      pitch: 1.0,
      rate: 0.95,
      preferredVoices: ['Google UK English Male', 'Microsoft David'],
    },
  },
  {
    id: 'casey_williams',
    name: 'Casey Williams',
    title: 'IT Director, Operations',
    role: 'Runs day-to-day IT ops, manages a team of 15',
    style: 'Risk-averse, pragmatic, values stability over innovation',
    hotButtons: 'Disruption to current workflows, migration effort, team retraining, reliability',
    convincedBy: 'Smooth migration paths, coexistence strategies, customer stories from similar environments',
    voiceConfig: {
      pitch: 0.9,
      rate: 0.9,
      preferredVoices: ['Google US English', 'Microsoft Zira'],
    },
  },
  {
    id: 'riley_park',
    name: 'Riley Park',
    title: 'Cloud Architect',
    role: 'Designs cloud strategy, reports to CTO',
    style: 'Forward-looking, opinionated, cloud-native mindset',
    hotButtons: 'Multi-cloud consistency, IaC best practices, developer experience, modern toolchain fit',
    convincedBy: 'Hybrid/multi-cloud positioning, integration with cloud-native stack, automation mesh architecture',
    voiceConfig: {
      pitch: 1.05,
      rate: 1.05,
      preferredVoices: ['Google UK English Female', 'Microsoft Susan'],
    },
  },
  {
    id: 'sam_okafor',
    name: 'Sam Okafor',
    title: 'CISO',
    role: 'Owns security and compliance posture',
    style: 'Methodical, compliance-focused, zero-trust mindset',
    hotButtons: 'Attack surface, credential management, audit trails, regulatory compliance',
    convincedBy: 'FIPS certifications, SOC 2 readiness, RBAC details, credential isolation, CVE response SLAs',
    voiceConfig: {
      pitch: 0.85,
      rate: 0.95,
      preferredVoices: ['Google US English', 'Microsoft David'],
    },
  },
] as const;

export function getPersonaById(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}
