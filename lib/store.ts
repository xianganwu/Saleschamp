import { create } from 'zustand';
import type { Persona, Scenario, SessionEntry, SessionMode, SessionState, TurnState } from '@/types/session';
import { getModeConfig } from '@/lib/mode-config';

const INITIAL_STATE = {
  mode: 'objection' as SessionMode,
  scenario: null,
  persona: null,
  currentRound: 1,
  maxRounds: 3,
  turnState: 'idle' as TurnState,
  transcript: [] as readonly SessionEntry[],
};

export const useSessionStore = create<SessionState>()((set) => ({
  ...INITIAL_STATE,

  setMode: (mode: SessionMode) =>
    set({ mode, maxRounds: getModeConfig(mode).maxRounds }),

  setScenario: (scenario: Scenario) => set({ scenario }),

  setPersona: (persona: Persona) => set({ persona }),

  addTranscriptEntry: (entry: SessionEntry) =>
    set((state) => ({
      transcript: [...state.transcript, entry],
    })),

  advanceRound: () =>
    set((state) => ({
      currentRound: Math.min(state.currentRound + 1, state.maxRounds),
    })),

  setTurnState: (turnState: TurnState) => set({ turnState }),

  resetSession: () => set(INITIAL_STATE),
}));
