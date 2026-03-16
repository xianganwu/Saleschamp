import type { ModeConfig, SessionMode } from '@/types/session';

export const MODE_CONFIGS: Record<SessionMode, ModeConfig> = {
  objection: {
    mode: 'objection',
    label: 'Objection Handling',
    description: 'Handle tough competitive objections across 3 rounds of realistic pushback.',
    maxRounds: 3,
    repGoesFirst: false,
    scoreDimensions: [
      'Objection Acknowledgment',
      'Value Articulation',
      'Competitive Accuracy',
      'Discovery & Listening',
      'Conversation Advancement',
    ],
  },
  pitch: {
    mode: 'pitch',
    label: 'Elevator Pitch',
    description: 'Deliver a compelling AAP value pitch and earn a follow-up meeting.',
    maxRounds: 2,
    repGoesFirst: true,
    scoreDimensions: [
      'Hook & Opening',
      'Persona Relevance',
      'Clarity & Conciseness',
      'Differentiation',
      'Call-to-Action',
    ],
  },
  discovery: {
    mode: 'discovery',
    label: 'Discovery Call',
    description: 'Uncover an existing Red Hat customer\'s automation needs through strategic questioning.',
    maxRounds: 5,
    repGoesFirst: false,
    scoreDimensions: [
      'Question Quality',
      'Active Listening',
      'Need Identification',
      'Qualification Depth',
      'Next-Step Relevance',
    ],
  },
};

export function getModeConfig(mode: SessionMode): ModeConfig {
  return MODE_CONFIGS[mode];
}
