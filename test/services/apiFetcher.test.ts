import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ApiFetcher from "../../src/services/apiFetcher";
import ApiClient from "../../src/services/apiClient";

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
});
