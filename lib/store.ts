import { create } from 'zustand';
import type { Persona, Scenario, SessionEntry, SessionState, TurnState } from '@/types/session';

const INITIAL_STATE = {
  scenario: null,
  persona: null,
  currentRound: 1,
  maxRounds: 3 as const,
  turnState: 'idle' as TurnState,
  transcript: [] as readonly SessionEntry[],
};

export const useSessionStore = create<SessionState>()((set) => ({
  ...INITIAL_STATE,

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
