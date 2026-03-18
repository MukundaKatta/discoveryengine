import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DiscoveryEngine - LLM-Powered Discovery",
  description: "Evolutionary search, Monaco editor, fitness landscape visualization, and problem library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
