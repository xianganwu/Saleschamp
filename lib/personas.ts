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
    environment: 'Financial services company with 5,200 servers across 3 data centers (New York, London, Singapore). Team of 40 infrastructure engineers managing hybrid cloud (60% on-prem, 40% AWS/Azure). Currently spending $2.1M/year on automation tooling. Board is pushing a 15% IT cost reduction initiative this fiscal year. Last major outage cost $4M in lost trading revenue.',
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
    environment: 'SaaS platform company running 8,500 servers across AWS and GCP. Platform team of 12 engineers supporting 200+ developers. Heavy Kubernetes adoption (70% of workloads containerized). Maintains 30+ internal Ansible collections on private Galaxy. Active contributor to several upstream Ansible projects. CI/CD pipeline runs 3,000+ automation jobs per day. Strong opinions about avoiding vendor lock-in after a painful Oracle migration 2 years ago.',
    voiceConfig: {
      pitch: 1.0,
      rate: 0.95,
      preferredVoices: ['Google UK English Male', 'Microsoft David'],
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
    environment: 'Healthcare technology provider managing 3,800 servers across on-prem (HIPAA-compliant colo) and Azure Gov. Subject to HIPAA, SOC 2 Type II, and FedRAMP Moderate audits. Security team of 15, just completed a zero-trust architecture initiative. Had a credential exposure incident 18 months ago that led to a full automation access review. Every tool must pass a 90-day security review before production deployment. SSH key rotation policy requires 30-day max lifetime.',
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
