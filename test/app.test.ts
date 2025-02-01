import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as App from "../src/app";
import { updateState } from "../src/services/stateManager";
import { RawModel, SportEventModel } from "../src/models";
import { getConfig } from "../src/config";

describe("App tests", () => {
  let app: App.AppContext;

  beforeEach(async () => {
    app = await App.init();
  });

  afterEach(async () => {
    await App.stop(app);
  });

  it("app initializes correctly", async () => {
    expect(app).toBeDefined();
    expect(app.server).toBeDefined();
    expect(app.fetcher).toBeDefined();
    expect(app.server.settings.port).toBe(4000);
    expect(app.server.settings.host).toBe("localhost");
  });

  it("should initialize server with custom port", async () => {
    const customPort = 4001;
    const mockConfig = {
      ...getConfig(),
      apiPort: customPort,
    };

    const newApp  = await App.init(mockConfig);
    expect(newApp.server.settings.port).toBe(customPort);
    await App.stop(newApp);
  });

  it("should return 404 when accessing a non-existent route", async () => {
    const { server } = app
    const res = await server.inject({
      method: "GET",
      url: "/non-existent-route",
    });

    expect(res.statusCode).toBe(404);
  });

  it("should return empty state initially", async () => {
    const { server } = app;
    const res = await server.inject({
      method: "GET",
      url: "/client/state",
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual({});
  });

  it("should return state after updating", async () => {
    const events: RawModel.SportEvent[] = [
      {
        id: "event1",
        sportId: "sport1",
        competitionId: "competition1",
        startTime: "1738195200000",
        homeCompetitorId: "home1",
        awayCompetitorId: "away1",
        status: "status1",
        scores: [{ periodId: "period0", homeScore: "0", awayScore: "0" }],
      },
    ];
    const mappings: RawModel.MappingDict = {
      event1: "event1",
      sport1: "FOOTBALL",
      competition1: "Champions League",
      home1: "Legia Warsaw",
      away1: "Barcelona",
      status1: "PRE",
      period0: "CURRENT",
      period1: "PERIOD_1",
    };

    updateState(events, mappings);
    const res = await app.server.inject({
      method: "GET",
      url: "/client/state",
    });

    expect(res.statusCode).toBe(200);
    expect(res.result).toEqual<SportEventModel.EventDict>({
      event1: {
        id: "event1",
        sport: "FOOTBALL",
        competition: "Champions League",
        startTime: "2025-01-30T00:00:00.000Z",
        status: "PRE",
        scores: {
          CURRENT: {
            type: "CURRENT",
            home: "0",
            away: "0",
          },
        },
        competitors: {
          HOME: {
            type: "HOME",
            name: "Legia Warsaw",
          },
          AWAY: {
            type: "AWAY",
            name: "Barcelona",
          },
        },
      },
    });
  });
});
