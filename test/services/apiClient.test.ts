import { describe, it, expect } from "vitest";
import ApiClient from "../../src/services/apiClient";

describe("ApiClient", () => {
  it("should be an instance of ApiClient", () => {
    const baseUrl = "https://simulation.api.example.com";
    const apiClient = new ApiClient(baseUrl);
    expect(apiClient).toBeInstanceOf(ApiClient);
  });
});
