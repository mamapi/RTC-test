import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ApiFetcher from "../../src/services/apiFetcher";
import ApiClient from "../../src/services/apiClient";
import Logger from "../../src/services/logger";
import * as parser from "../../src/services/parser";

describe("ApiFetcher", () => {
  let apiClient: ApiClient;
  let fetcher: ApiFetcher;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global, "setInterval");
    apiClient = new ApiClient("http://localhost:3000");
    fetcher = new ApiFetcher(apiClient, 1000);
  });

  afterEach(() => {
    fetcher.stop();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should create instance with specified interval", () => {
    expect(fetcher).toBeInstanceOf(ApiFetcher);
  });

  it("should not execute more ticks after stop is called", async () => {
    const expectedCalls = 2;
    const onTickSpy = vi.spyOn(fetcher as any, "onTick").mockImplementation(() => Promise.resolve());

    fetcher.start();
    await vi.advanceTimersByTimeAsync(1000 * expectedCalls);
    expect(onTickSpy).toHaveBeenCalledTimes(expectedCalls);

    fetcher.stop();
    await vi.advanceTimersByTimeAsync(1000);

    expect(onTickSpy).toHaveBeenCalledTimes(expectedCalls);
  });

  it("should not execute overlapping ticks if execution time is longer", async () => {
    const onTickSpy = vi.spyOn(fetcher as any, "onTick").mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 1500); // tick takes longer than interval
        })
    );

    fetcher.start();

    // simulate 3 seconds (3000 ms)
    await vi.advanceTimersByTimeAsync(3000);

    // if ticks overlapped, there should be 3 calls (3000ms / 1000ms = 3)
    // if blocking works correctly, only 2 ticks will finish
    expect(onTickSpy).toHaveBeenCalledTimes(2);

    fetcher.stop();
  });

  it("should not allow multiple start calls", () => {
    const expectedCalls = 1;
    
    fetcher.start();
    fetcher.start();

    expect(setInterval).toHaveBeenCalledTimes(expectedCalls);
  });

  it("should handle API errors without crashing and continue fetching", async () => {
    const expectedErrorMessage = "API Error";
    const apiFetchStateSpy = vi.spyOn(apiClient, "fetchState").mockRejectedValue(expectedErrorMessage);
    const loggerSpy = vi.spyOn(Logger, "error").mockImplementation(() => {});

    fetcher.start();

    // First tick - should log error
    await vi.advanceTimersByTimeAsync(1000);
    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining(expectedErrorMessage));

    // Check if the timer is still running
    await vi.advanceTimersByTimeAsync(1000);
    expect(apiFetchStateSpy).toHaveBeenCalledTimes(2);

    fetcher.stop();
  });

  it("should handle parsing errors without crashing and continue fetching", async () => {
    const expectedErrorMessage = "Failed to parse odds data";
    const apiFetchStateSpy = vi.spyOn(apiClient, "fetchState").mockResolvedValue({ odds: "{}" });
    const apiFetchMappingsSpy = vi.spyOn(apiClient, "fetchMappings").mockResolvedValue({ mappings: "{}" });
    const loggerSpy = vi.spyOn(Logger, "error").mockImplementation(() => {});
    vi.spyOn(parser, "parseMappings").mockImplementation(() => {
      throw new Error(expectedErrorMessage);
    });

    fetcher.start();

    // First tick - should log error
    await vi.advanceTimersByTimeAsync(1000);
    expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining(expectedErrorMessage));

    // Check if the timer is still running
    await vi.advanceTimersByTimeAsync(1000);
    expect(apiFetchStateSpy).toHaveBeenCalledTimes(2);
    expect(apiFetchMappingsSpy).toHaveBeenCalledTimes(2);

    fetcher.stop();
  });
});
