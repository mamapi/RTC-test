import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SimulationPooler from "../../src/services/simulationPooler";

describe("SimulationPooler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create instance with specified interval", () => {
    const pooler = new SimulationPooler(1000);
    expect(pooler).toBeInstanceOf(SimulationPooler);
  });
});
