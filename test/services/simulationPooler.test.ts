import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SimulationPooler from "../../src/services/simulationPooler";
import ApiClient from "../../src/services/apiClient";

describe("SimulationPooler", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create instance with specified interval", () => {
    const apiClient = new ApiClient("http://localhost:3000");
    const pooler = new SimulationPooler(apiClient, 1000);
    expect(pooler).toBeInstanceOf(SimulationPooler);
  });

  it("should not execute more ticks after stop is called", () => {
    const apiClient = new ApiClient("http://localhost:3000");
    const pooler = new SimulationPooler(apiClient, 1000);
    const onTickSpy = vi.spyOn(pooler as any, "onTick");
    const expectedCalls = 2;

    pooler.start();
    vi.advanceTimersByTime(1000 * expectedCalls);
    expect(onTickSpy).toHaveBeenCalledTimes(expectedCalls);

    pooler.stop();
    vi.advanceTimersByTime(1000);

    expect(onTickSpy).toHaveBeenCalledTimes(expectedCalls);
  });
});
