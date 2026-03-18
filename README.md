# DiscoveryEngine

> AI-Powered Evolutionary Code Optimization Platform

DiscoveryEngine is a platform for solving optimization problems through evolutionary algorithms. Write fitness functions in an integrated code editor, run evolutionary simulations, and visualize solution landscapes and convergence.

## Features

- **Code Editor** -- Monaco-powered editor for writing fitness functions and problem definitions
- **Evolution Panel** -- Configure and run genetic algorithms with real-time progress
- **Solution Visualizer** -- Charts and graphs showing population fitness over generations
- **Fitness Landscape** -- 3D visualization of the optimization search space
- **Problem Library** -- Pre-built optimization problems to explore and learn from

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Code Editor:** Monaco Editor (@monaco-editor/react)
- **Database:** Supabase (PostgreSQL)
- **Charts:** Recharts
- **State Management:** Zustand
- **Icons:** Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your SUPABASE_URL and SUPABASE_ANON_KEY

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
  app/
    page.tsx                # Main application with icon-based tab navigation
  components/
    CodeEditor.tsx          # Monaco-based code editor (dynamic import)
    EvolutionPanel.tsx      # Evolutionary algorithm controls
    SolutionVisualizer.tsx  # Solution charts and metrics
    FitnessLandscape.tsx    # 3D fitness landscape viewer
    ProblemLibrary.tsx      # Pre-built problem catalog
  lib/
    store.ts                # Zustand state management
```

