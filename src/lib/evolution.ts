export interface Individual {
  genes: number[];
  fitness: number;
}

export interface EvolutionConfig {
  popSize: number;
  dimensions: number;
  mutationRate: number;
  crossoverRate: number;
  fitnessFunction: string;
}

export function evaluateFitness(genes: number[], fnName: string): number {
  switch (fnName) {
    case "sphere":
      return -genes.reduce((s, g) => s + g * g, 0);
    case "rastrigin": {
      const n = genes.length;
      return -(10 * n + genes.reduce((s, g) => s + g * g - 10 * Math.cos(2 * Math.PI * g), 0));
    }
    case "rosenbrock":
      let sum = 0;
      for (let i = 0; i < genes.length - 1; i++) {
        sum += 100 * Math.pow(genes[i + 1] - genes[i] * genes[i], 2) + Math.pow(1 - genes[i], 2);
      }
      return -sum;
    case "ackley": {
      const n = genes.length;
      const sq = genes.reduce((s, g) => s + g * g, 0) / n;
      const cs = genes.reduce((s, g) => s + Math.cos(2 * Math.PI * g), 0) / n;
      return -(- 20 * Math.exp(-0.2 * Math.sqrt(sq)) - Math.exp(cs) + 20 + Math.E);
    }
    default:
      return -genes.reduce((s, g) => s + g * g, 0);
  }
}

export function initPopulation(size: number, dims: number): Individual[] {
  return Array.from({ length: size }, () => {
    const genes = Array.from({ length: dims }, () => Math.random() * 10 - 5);
    return { genes, fitness: 0 };
  });
}

export function evolveGeneration(
  pop: Individual[],
  config: EvolutionConfig
): Individual[] {
  // Sort by fitness descending
  const sorted = [...pop].sort((a, b) => b.fitness - a.fitness);
  const newPop: Individual[] = [];

  // Elitism: keep top 2
  newPop.push({ ...sorted[0] }, { ...sorted[1] });

  while (newPop.length < config.popSize) {
    // Tournament selection
    const parent1 = tournamentSelect(sorted);
    const parent2 = tournamentSelect(sorted);

    let child: number[];
    if (Math.random() < config.crossoverRate) {
      child = crossover(parent1.genes, parent2.genes);
    } else {
      child = [...parent1.genes];
    }

    child = mutate(child, config.mutationRate);

    newPop.push({
      genes: child,
      fitness: evaluateFitness(child, config.fitnessFunction),
    });
  }

  return newPop.slice(0, config.popSize);
}

function tournamentSelect(pop: Individual[]): Individual {
  const a = pop[Math.floor(Math.random() * pop.length)];
  const b = pop[Math.floor(Math.random() * pop.length)];
  return a.fitness > b.fitness ? a : b;
}

function crossover(a: number[], b: number[]): number[] {
  const point = Math.floor(Math.random() * a.length);
  return [...a.slice(0, point), ...b.slice(point)];
}

function mutate(genes: number[], rate: number): number[] {
  return genes.map((g) =>
    Math.random() < rate ? g + (Math.random() - 0.5) * 2 : g
  );
}

export const problemLibrary = [
  { id: "sphere", name: "Sphere Function", desc: "Minimize sum of squares", dims: 10, difficulty: "Easy" },
  { id: "rastrigin", name: "Rastrigin Function", desc: "Multimodal with many local minima", dims: 10, difficulty: "Hard" },
  { id: "rosenbrock", name: "Rosenbrock Function", desc: "Valley-shaped with narrow optimum", dims: 10, difficulty: "Medium" },
  { id: "ackley", name: "Ackley Function", desc: "Many local minima around global", dims: 10, difficulty: "Hard" },
];
