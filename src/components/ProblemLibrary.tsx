"use client";

import { problemLibrary } from "@/lib/evolution";
import { useDiscoveryStore } from "@/lib/store";
import { BookOpen, ArrowRight } from "lucide-react";

const diffColors: Record<string, string> = {
  Easy: "text-green-400 bg-green-500/20",
  Medium: "text-amber-400 bg-amber-500/20",
  Hard: "text-red-400 bg-red-500/20",
};

export default function ProblemLibrary() {
  const { setTab } = useDiscoveryStore();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen size={22} className="text-blue-400" /> Problem Library
        </h2>
        <p className="text-sm text-slate-400">Benchmark optimization problems</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {problemLibrary.map((prob) => (
          <div key={prob.id} className="glass-panel p-6">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs px-2 py-0.5 rounded ${diffColors[prob.difficulty]}`}>
                {prob.difficulty}
              </span>
              <span className="text-xs text-slate-500">{prob.dims}D</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{prob.name}</h3>
            <p className="text-sm text-slate-400 mb-4">{prob.desc}</p>
            <button
              onClick={() => setTab("evolution")}
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Solve <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
