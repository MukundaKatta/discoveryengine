"use client";

import dynamic from "next/dynamic";
import { useDiscoveryStore, TabMode } from "@/lib/store";
import EvolutionPanel from "@/components/EvolutionPanel";
import SolutionVisualizer from "@/components/SolutionVisualizer";
import FitnessLandscape from "@/components/FitnessLandscape";
import ProblemLibrary from "@/components/ProblemLibrary";
import { Rocket, Code, Dna, BarChart3, Mountain, BookOpen } from "lucide-react";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), { ssr: false });

const tabs: { key: TabMode; label: string; icon: React.ReactNode }[] = [
  { key: "editor", label: "Code Editor", icon: <Code size={18} /> },
  { key: "evolution", label: "Evolution", icon: <Dna size={18} /> },
  { key: "visualizer", label: "Visualizer", icon: <BarChart3 size={18} /> },
  { key: "landscape", label: "Landscape", icon: <Mountain size={18} /> },
  { key: "library", label: "Problems", icon: <BookOpen size={18} /> },
];

export default function HomePage() {
  const { tab, setTab } = useDiscoveryStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a1a]">
      <div className="w-16 h-full glass-panel flex flex-col items-center py-6 gap-1">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6">
          <Rocket size={20} className="text-white" />
        </div>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              tab === t.key ? "bg-green-500/20 text-green-400" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
            }`} title={t.label}
          >{t.icon}</button>
        ))}
      </div>
      <div className="flex-1 overflow-hidden">
        {tab === "editor" && <CodeEditor />}
        {tab === "evolution" && <EvolutionPanel />}
        {tab === "visualizer" && <SolutionVisualizer />}
        {tab === "landscape" && <FitnessLandscape />}
        {tab === "library" && <ProblemLibrary />}
      </div>
    </div>
  );
}
