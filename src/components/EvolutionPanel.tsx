"use client";

import { useState, useEffect, useCallback } from "react";
import { useDiscoveryStore } from "@/lib/store";
import { initPopulation, evolveGeneration, evaluateFitness, EvolutionConfig } from "@/lib/evolution";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";

export default function EvolutionPanel() {
  const {
    isRunning, setIsRunning, generation, setGeneration,
    population, setPopulation, bestFitness, setBestFitness,
    fitnessHistory, addFitnessHistory,
  } = useDiscoveryStore();

  const [config, setConfig] = useState<EvolutionConfig>({
    popSize: 50,
    dimensions: 10,
    mutationRate: 0.1,
    crossoverRate: 0.7,
    fitnessFunction: "sphere",
  });

  const initialize = useCallback(() => {
    const pop = initPopulation(config.popSize, config.dimensions);
    pop.forEach((ind) => {
      ind.fitness = evaluateFitness(ind.genes, config.fitnessFunction);
    });
    setPopulation(pop.map((ind, i) => ({
      id: `ind-${i}`,
      code: JSON.stringify(ind.genes.map((g) => +g.toFixed(3))),
      fitness: ind.fitness,
      generation: 0,
      mutations: [],
    })));
    setGeneration(0);
    setBestFitness(Math.max(...pop.map((p) => p.fitness)));
  }, [config]);

  const step = useCallback(() => {
    if (population.length === 0) return;
    const individuals = population.map((s) => ({
      genes: JSON.parse(s.code) as number[],
      fitness: s.fitness,
    }));
    const evolved = evolveGeneration(individuals, config);
    const gen = generation + 1;
    const best = Math.max(...evolved.map((e) => e.fitness));
    const avg = evolved.reduce((s, e) => s + e.fitness, 0) / evolved.length;

    setPopulation(evolved.map((ind, i) => ({
      id: `ind-${gen}-${i}`,
      code: JSON.stringify(ind.genes.map((g) => +g.toFixed(3))),
      fitness: ind.fitness,
      generation: gen,
      mutations: [],
    })));
    setGeneration(gen);
    setBestFitness(best);
    addFitnessHistory({ gen, best, avg });
  }, [population, generation, config]);

  useEffect(() => {
    if (!isRunning) return;
    const timer = setInterval(step, 100);
    return () => clearInterval(timer);
  }, [isRunning, step]);

  const reset = () => {
    setIsRunning(false);
    setPopulation([]);
    setGeneration(0);
    setBestFitness(-Infinity);
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Evolutionary Search</h2>
          <p className="text-sm text-slate-400">Generation: {generation} | Best: {bestFitness.toFixed(4)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={initialize} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors">
            Init
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? "Pause" : "Run"}
          </button>
          <button onClick={step} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors">
            Step
          </button>
          <button onClick={reset} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Config */}
      <div className="glass-panel p-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-300">Parameters</span>
        </div>
        <div className="grid grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-slate-500">Population</label>
            <input type="number" value={config.popSize}
              onChange={(e) => setConfig({ ...config, popSize: +e.target.value })}
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Dimensions</label>
            <input type="number" value={config.dimensions}
              onChange={(e) => setConfig({ ...config, dimensions: +e.target.value })}
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Mutation Rate</label>
            <input type="number" step={0.01} value={config.mutationRate}
              onChange={(e) => setConfig({ ...config, mutationRate: +e.target.value })}
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Crossover Rate</label>
            <input type="number" step={0.01} value={config.crossoverRate}
              onChange={(e) => setConfig({ ...config, crossoverRate: +e.target.value })}
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">Function</label>
            <select value={config.fitnessFunction}
              onChange={(e) => setConfig({ ...config, fitnessFunction: e.target.value })}
              className="w-full mt-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-white"
            >
              <option value="sphere">Sphere</option>
              <option value="rastrigin">Rastrigin</option>
              <option value="rosenbrock">Rosenbrock</option>
              <option value="ackley">Ackley</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fitness Chart */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">Fitness Over Generations</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={fitnessHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="gen" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
            <Legend />
            <Line type="monotone" dataKey="best" stroke="#22c55e" strokeWidth={2} dot={false} name="Best" />
            <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Average" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Solutions */}
      <div className="glass-panel p-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Top Solutions</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[...population].sort((a, b) => b.fitness - a.fitness).slice(0, 5).map((sol, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-slate-800/50 rounded-lg">
              <span className="text-xs font-mono text-amber-400 w-6">#{i + 1}</span>
              <span className="text-xs font-mono text-slate-400 flex-1 truncate">{sol.code}</span>
              <span className="text-xs font-mono text-green-400">{sol.fitness.toFixed(4)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
