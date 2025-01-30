import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { init } from "../../src/app";
import { Server } from "@hapi/hapi";
import { getActiveEvents } from "../../src/services/stateManager";
import { SportEventModel } from "../../src/models";

vi.mock("../../src/services/stateManager", () => ({
  getActiveEvents: vi.fn(),
}));

describe("GET /client/state", () => {
  let server: Server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
    vi.clearAllMocks();
  });

  it("should return active events", async () => {
    const mockEvents: SportEventModel.EventDict = {
      "1": {
        id: "1",
        competition: "1",
        sport: "1",
        startTime: "1",
        competitors: {
          HOME: {
            type: "HOME",
            name: "1",
          },
          AWAY: {
            type: "AWAY",
            name: "2",
          },
        },
        status: "PRE",
        scores: {
          CURRENT: {
            type: "CURRENT",
            home: "0",
            away: "0",
          },
        },
      },
    };
    vi.mocked(getActiveEvents).mockReturnValue(mockEvents);

    const response = await server.inject({
      method: "GET",
      url: "/client/state",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual(mockEvents);
  });

  it("should handle errors properly", async () => {
    vi.mocked(getActiveEvents).mockImplementation(() => {
      throw new Error("Test error");
    });

    const response = await server.inject({
      method: "GET",
      url: "/client/state",
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toEqual({ error: "Internal Server Error" });
  });
});
