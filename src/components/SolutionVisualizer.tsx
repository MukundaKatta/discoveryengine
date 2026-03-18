"use client";

import { useDiscoveryStore } from "@/lib/store";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from "recharts";
import { BarChart3 } from "lucide-react";

export default function SolutionVisualizer() {
  const { population, generation, bestFitness } = useDiscoveryStore();

  const scatterData = population.map((sol) => {
    const genes = JSON.parse(sol.code || "[]") as number[];
    return { x: genes[0] || 0, y: genes[1] || 0, fitness: sol.fitness };
  });

  const fitnessDistribution = (() => {
    if (population.length === 0) return [];
    const fitnesses = population.map((p) => p.fitness);
    const min = Math.min(...fitnesses);
    const max = Math.max(...fitnesses);
    const range = max - min || 1;
    const bins = 10;
    const counts = Array(bins).fill(0);
    fitnesses.forEach((f) => {
      const idx = Math.min(bins - 1, Math.floor(((f - min) / range) * bins));
      counts[idx]++;
    });
    return counts.map((count, i) => ({
      range: `${(min + (i / bins) * range).toFixed(1)}`,
      count,
    }));
  })();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart3 size={22} className="text-purple-400" /> Solution Visualizer
        </h2>
        <p className="text-sm text-slate-400">Gen: {generation} | Pop: {population.length} | Best: {bestFitness.toFixed(4)}</p>
      </div>

      {population.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <p className="text-slate-500">Run the evolutionary search to see visualizations</p>
        </div>
      ) : (
        <>
          <div className="glass-panel p-6">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Population Distribution (Dim 1 vs 2)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} name="Dim 1" />
                <YAxis dataKey="y" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} name="Dim 2" />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
                <Scatter data={scatterData} fill="#8b5cf6" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-6">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Fitness Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={fitnessDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px", color: "#e2e8f0" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {fitnessDistribution.map((_, i) => (
                    <Cell key={i} fill={`hsl(${120 + (i / fitnessDistribution.length) * 120}, 70%, 50%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
