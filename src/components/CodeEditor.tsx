"use client";

import { useDiscoveryStore } from "@/lib/store";
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  const { code, setCode } = useDiscoveryStore();

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-slate-700/50 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Problem Definition</span>
        <span className="text-xs text-slate-500">JavaScript</span>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={(v) => setCode(v || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            padding: { top: 16 },
            wordWrap: "on",
            tabSize: 2,
          }}
        />
      </div>
    </div>
  );
}
