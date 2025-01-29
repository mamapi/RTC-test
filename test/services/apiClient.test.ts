import { describe, it, expect, vi } from "vitest";
import ApiClient from "../../src/services/apiClient";

describe("ApiClient", () => {
  const baseUrl = "https://simulation.api.example.com";
  const apiClient = new ApiClient(baseUrl);

  it("should be an instance of ApiClient", () => {
    expect(apiClient).toBeInstanceOf(ApiClient);
  });

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
  });
});
