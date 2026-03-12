export interface Scenario {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly category: ScenarioCategory;
  readonly context: string;
  readonly tips: readonly string[];
}

export type ScenarioCategory = 'upstream' | 'competitive' | 'value' | 'technical';

export interface Persona {
  readonly id: PersonaId;
  readonly name: string;
  readonly title: string;
  readonly role: string;
  readonly style: string;
  readonly hotButtons: string;
  readonly convincedBy: string;
  readonly voiceConfig: VoiceConfig;
}

export type PersonaId =
  | 'morgan_chen'
  | 'jamie_torres'
  | 'sam_okafor';

export interface VoiceConfig {
  readonly pitch: number;
  readonly rate: number;
  readonly preferredVoices: readonly string[];
}

export type TurnState = 'idle' | 'rep' | 'processing' | 'prospect' | 'feedback';

export interface SessionEntry {
  readonly speaker: 'rep' | 'prospect';
  readonly text: string;
  readonly round: number;
  readonly timestamp: Date;
}

export interface ScoreCard {
  readonly objectionAcknowledgment: number;
  readonly valueArticulation: number;
  readonly competitiveAccuracy: number;
  readonly discoveryAndListening: number;
  readonly conversationAdvancement: number;
  readonly strengths: readonly string[];
  readonly improvement: string;
  readonly overall: string;
}

export interface SessionState {
  scenario: Scenario | null;
  persona: Persona | null;
  currentRound: number;
  maxRounds: 3;
  turnState: TurnState;
  transcript: readonly SessionEntry[];

  setScenario: (scenario: Scenario) => void;
  setPersona: (persona: Persona) => void;
  addTranscriptEntry: (entry: SessionEntry) => void;
  advanceRound: () => void;
  setTurnState: (state: TurnState) => void;
  resetSession: () => void;
}

export interface SessionApiRequest {
  readonly messages: readonly SessionEntry[];
  readonly scenario: string;
  readonly scenarioContext: string;
  readonly personaId: PersonaId;
  readonly round: number;
}

export interface SessionApiResponse {
  readonly response: string;
  readonly isComplete: boolean;
}

export interface FeedbackApiRequest {
  readonly transcript: readonly SessionEntry[];
  readonly scenario: string;
  readonly personaId: PersonaId;
}

export interface FeedbackApiResponse {
  readonly scores: number[];
  readonly strengths: string[];
  readonly improvement: string;
  readonly overall: string;
}
