import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ApiClient, { StateResponse, MappingsResponse } from "../../src/services/apiClient";
import Logger from "../../src/services/logger";

vi.mock("../../src/services/logger");

describe("ApiClient", () => {
  const baseUrl = "https://simulation.api.example.com";
  const apiClient = new ApiClient(baseUrl);

  it("should be an instance of ApiClient", () => {
    expect(apiClient).toBeInstanceOf(ApiClient);
  });

  describe("fetchState", () => {
    it("should fetch state correctly", async () => {
      const mockResponse: StateResponse = {
        odds: "1,2,3",
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const response = await apiClient.fetchState();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/state`, { signal: expect.any(AbortSignal) });
    });

    it("should throw an error if the response is not ok", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(apiClient.fetchState()).rejects.toThrow();
    });
  });

  describe("fetchMappings", () => {
    it("should fetch mappings correctly", async () => {
      const mockResponse: MappingsResponse = {
        mappings: "d1:value1;id2:value2",
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const response = await apiClient.fetchMappings();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/mappings`, { signal: expect.any(AbortSignal) });
    });

    it("should throw an error if the response is not ok", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(apiClient.fetchMappings()).rejects.toThrow();
    });
  });

  describe("timeout handling", () => {
    beforeEach(() => {
      vi.spyOn(globalThis, "fetch").mockImplementation((_, options) => {
        return new Promise((_, reject) => {
          if (options?.signal) {
            (options.signal as AbortSignal).addEventListener("abort", () => {
              const timeoutError = new Error("Timeout Error Message");
              timeoutError.name = "TimeoutError";
              reject(timeoutError);
            });
          }
        });
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should abort the fetchState request if it takes too long", async () => {
      const timeoutMs = 10;
      const slowApiClient = new ApiClient(baseUrl, timeoutMs);

      const fetchPromise = slowApiClient.fetchState();

      await expect(fetchPromise).rejects.toThrow("Timeout Error Message");
      expect(Logger.error).toHaveBeenCalledWith(`Request to /state timed out after ${timeoutMs}ms`);
    });
  });
});
