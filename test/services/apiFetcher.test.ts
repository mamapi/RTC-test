import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ApiFetcher from "../../src/services/apiFetcher";
import ApiClient from "../../src/services/apiClient";
import Logger from "../../src/services/logger";
import * as parser from "../../src/services/parser";

describe("ApiFetcher", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create instance with specified interval", () => {
    const apiClient = new ApiClient("http://localhost:3000");
    const fetcher = new ApiFetcher(apiClient, 1000);
    expect(fetcher).toBeInstanceOf(ApiFetcher);
  });

  it("should not execute more ticks after stop is called", () => {
    const apiClient = new ApiClient("http://localhost:3000");
    const fetcher = new ApiFetcher(apiClient, 1000);
    const onTickSpy = vi.spyOn(fetcher as any, "onTick");
    const expectedCalls = 2;

    fetcher.start();
    vi.advanceTimersByTime(1000 * expectedCalls);
    expect(onTickSpy).toHaveBeenCalledTimes(expectedCalls);

    fetcher.stop();
    vi.advanceTimersByTime(1000);

    expect(onTickSpy).toHaveBeenCalledTimes(expectedCalls);
  });

  it("should handle API errors without crashing and continue fetching", async () => {
    const apiClient = new ApiClient("http://localhost:3000");
    const fetcher = new ApiFetcher(apiClient, 1000);
    const expectedErrorMessage = "API Error";
    const apiFetchStateSpy = vi.spyOn(apiClient, "fetchState").mockRejectedValue(new Error(expectedErrorMessage));
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
    const apiClient = new ApiClient("http://localhost:3000");
    const fetcher = new ApiFetcher(apiClient, 1000);
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
