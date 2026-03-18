import { create } from "zustand";

export type TabMode = "editor" | "evolution" | "visualizer" | "landscape" | "library";

export interface Solution {
  id: string;
  code: string;
  fitness: number;
  generation: number;
  mutations: string[];
}

interface DiscoveryStore {
  tab: TabMode;
  setTab: (t: TabMode) => void;
  code: string;
  setCode: (v: string) => void;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
  generation: number;
  setGeneration: (v: number) => void;
  population: Solution[];
  setPopulation: (v: Solution[]) => void;
  bestFitness: number;
  setBestFitness: (v: number) => void;
  fitnessHistory: { gen: number; best: number; avg: number }[];
  addFitnessHistory: (entry: { gen: number; best: number; avg: number }) => void;
}

export const useDiscoveryStore = create<DiscoveryStore>((set) => ({
  tab: "editor",
  setTab: (t) => set({ tab: t }),
  code: `// Define your optimization problem
function fitness(solution) {
  // Minimize: Sphere function
  let sum = 0;
  for (let i = 0; i < solution.length; i++) {
    sum += solution[i] * solution[i];
  }
  return -sum; // Negate for maximization
}

// Parameters
const DIMENSIONS = 10;
const POPULATION_SIZE = 50;
const MUTATION_RATE = 0.1;
const CROSSOVER_RATE = 0.7;

// Initialize population
function initialize() {
  return Array.from({ length: POPULATION_SIZE }, () =>
    Array.from({ length: DIMENSIONS }, () => Math.random() * 20 - 10)
  );
}`,
  setCode: (v) => set({ code: v }),
  isRunning: false,
  setIsRunning: (v) => set({ isRunning: v }),
  generation: 0,
  setGeneration: (v) => set({ generation: v }),
  population: [],
  setPopulation: (v) => set({ population: v }),
  bestFitness: -Infinity,
  setBestFitness: (v) => set({ bestFitness: v }),
  fitnessHistory: [],
  addFitnessHistory: (entry) => set((s) => ({ fitnessHistory: [...s.fitnessHistory, entry] })),
}));
