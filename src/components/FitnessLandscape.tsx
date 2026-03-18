"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { evaluateFitness } from "@/lib/evolution";
import { Mountain } from "lucide-react";

export default function FitnessLandscape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fnName, setFnName] = useState("sphere");
  const [rotationX, setRotationX] = useState(0.6);
  const [rotationZ, setRotationZ] = useState(0.4);
  const [resolution, setResolution] = useState(40);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    const range = fnName === "rastrigin" ? 5.12 : fnName === "ackley" ? 5 : 5;
    const grid: { x: number; y: number; z: number; screenX: number; screenY: number }[][] = [];

    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const cosZ = Math.cos(rotationZ);
    const sinZ = Math.sin(rotationZ);

    let minZ = Infinity, maxZ = -Infinity;

    for (let i = 0; i <= resolution; i++) {
      grid[i] = [];
      for (let j = 0; j <= resolution; j++) {
        const x = -range + (2 * range * i) / resolution;
        const y = -range + (2 * range * j) / resolution;
        const z = evaluateFitness([x, y], fnName);
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
        grid[i][j] = { x, y, z, screenX: 0, screenY: 0 };
      }
    }

    // Project to 2D with rotation
    const scale = Math.min(w, h) * 0.25;
    const cx = w / 2, cy = h / 2;

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const p = grid[i][j];
        const nx = p.x / range;
        const ny = p.y / range;
        const nz = (p.z - minZ) / (maxZ - minZ || 1);

        const rx = nx * cosZ - ny * sinZ;
        const ry = (nx * sinZ + ny * cosZ) * cosX - nz * sinX;

        p.screenX = cx + rx * scale;
        p.screenY = cy - ry * scale;
      }
    }

    // Draw surface
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const p1 = grid[i][j];
        const p2 = grid[i + 1][j];
        const p3 = grid[i + 1][j + 1];
        const p4 = grid[i][j + 1];

        const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
        const t = (avgZ - minZ) / (maxZ - minZ || 1);

        const r = Math.round(30 + t * 150);
        const g = Math.round(50 + (1 - Math.abs(t - 0.5) * 2) * 150);
        const b = Math.round(200 - t * 150);

        ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
        ctx.strokeStyle = `rgba(${r},${g},${b},0.9)`;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.moveTo(p1.screenX, p1.screenY);
        ctx.lineTo(p2.screenX, p2.screenY);
        ctx.lineTo(p3.screenX, p3.screenY);
        ctx.lineTo(p4.screenX, p4.screenY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
  }, [fnName, rotationX, rotationZ, resolution]);

  useEffect(() => { draw(); }, [draw]);

  const handleDrag = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    setRotationZ((prev) => prev + e.movementX * 0.01);
    setRotationX((prev) => Math.max(0.1, Math.min(1.5, prev - e.movementY * 0.01)));
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Mountain size={22} className="text-green-400" /> Fitness Landscape
        </h2>
        <p className="text-sm text-slate-400">Drag to rotate. Visualize the optimization surface.</p>
      </div>

      <div className="flex gap-3">
        {["sphere", "rastrigin", "rosenbrock", "ackley"].map((fn) => (
          <button key={fn} onClick={() => setFnName(fn)}
            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
              fnName === fn ? "bg-green-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >{fn}</button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          <span>Resolution:</span>
          <input type="range" min={15} max={80} value={resolution}
            onChange={(e) => setResolution(+e.target.value)} className="w-24"
          />
          <span className="font-mono">{resolution}</span>
        </div>
      </div>

      <div className="flex-1 glass-panel p-2">
        <canvas ref={canvasRef} onMouseMove={handleDrag} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>
    </div>
  );
}
