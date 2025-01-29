import { describe, it, expect, vi } from "vitest";
import ApiClient from "../../src/services/apiClient";

describe("ApiClient", () => {
  const baseUrl = "https://simulation.api.example.com";
  const apiClient = new ApiClient(baseUrl);

  it("should be an instance of ApiClient", () => {
    expect(apiClient).toBeInstanceOf(ApiClient);
  });

  describe("fetchState", () => {
    it("should fetch state correctly", async () => {
      const mockResponse = {
        odds: "1,2,3",
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const response = await apiClient.fetchState();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/state`);
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
      const mockResponse = {
        mappings: "d1:value1;id2:value2",
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      });

      const response = await apiClient.fetchMappings();

      expect(response).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/mappings`);
    });

    it("should throw an error if the response is not ok", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
      });

      await expect(apiClient.fetchMappings()).rejects.toThrow();
    });
  });
});
