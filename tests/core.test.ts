import { describe, it, expect } from "vitest";
import { Discoveryengine } from "../src/core.js";
describe("Discoveryengine", () => {
  it("init", () => { expect(new Discoveryengine().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Discoveryengine(); await c.search(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Discoveryengine(); await c.search(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
