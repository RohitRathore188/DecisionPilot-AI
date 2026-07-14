import { create } from "zustand";

export interface DecisionVariable {
  id: string;
  name: string;
  key: string;
  type: "currency" | "percentage" | "number" | "boolean";
  value: number | boolean;
  min?: number;
  max?: number;
  description?: string;
}

export interface DecisionOption {
  id: string;
  name: string;
  description: string;
  modifications: Record<string, number>; // maps variable key to multiplier/offset value
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  status: "draft" | "running" | "completed" | "failed";
  variables: DecisionVariable[];
  options: DecisionOption[];
  results?: SimulationResult | null;
}

export interface SimulationResult {
  decisionId: string;
  simulatedAt: string;
  confidenceScore: number;
  outcomes: {
    optionId: string;
    optionName: string;
    metrics: {
      revenue: number[];
      cost: number[];
      profit: number[];
      roi: number;
    };
  }[];
  sensitivityAnalysis: {
    variableKey: string;
    impactLevel: "high" | "medium" | "low";
    description: string;
  }[];
}

interface DecisionState {
  decisions: Decision[];
  activeDecisionId: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  setDecisions: (decisions: Decision[]) => void;
  setActiveDecisionId: (id: string | null) => void;
  addDecision: (decision: Decision) => void;
  updateDecision: (id: string, updates: Partial<Decision>) => void;
  deleteDecision: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Zustand store to manage active decisions and simulations client-side state.
 */
export const useDecisionStore = create<DecisionState>((set) => ({
  decisions: [],
  activeDecisionId: null,
  loading: false,
  error: null,

  setDecisions: (decisions) => set({ decisions }),
  setActiveDecisionId: (id) => set({ activeDecisionId: id }),
  addDecision: (decision) =>
    set((state) => ({ decisions: [decision, ...state.decisions] })),
  updateDecision: (id, updates) =>
    set((state) => ({
      decisions: state.decisions.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),
  deleteDecision: (id) =>
    set((state) => ({
      decisions: state.decisions.filter((d) => d.id !== id),
      activeDecisionId: state.activeDecisionId === id ? null : state.activeDecisionId,
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
