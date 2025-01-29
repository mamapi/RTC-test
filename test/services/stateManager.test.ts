import { describe, expect, it } from "vitest";
import { MappingDictionary, SportEventOdd } from "../../src/services/parser";

describe("StateManager", () => {
  it("should update the state correctly", () => {
    const odds: SportEventOdd[] = [
      {
        id: "event1",
        sportId: "sport1",
        competitionId: "competition1",
        startTime: "1",
        homeCompetitorId: "home1",
        awayCompetitorId: "away1",
        status: "status1",
        scores: [
          {
            periodId: "CURRENT",
            homeScore: "1",
            awayScore: "2",
          },
        ],
      },
    ];
    const mappings: MappingDictionary = {
      event1: "event1",
      sport1: "FOOTBALL",
      competition1: "competition1",
      home1: "Real Madrid",
      away1: "Barcelona",
      status1: "LIVE",
    };

    updateState(odds, mappings);

    expect(getState()).toEqual({
      event1: {
        id: "event1",
        status: "LIVE",
        startTime: "1",
        sport: "FOOTBALL",
        competition: "competition1",
        competitors: {
          HOME: {
            type: "HOME",
            name: "Real Madrid",
          },
          AWAY: {
            type: "AWAY",
            name: "Barcelona",
          },
        },
        scores: {
          CURRENT: {
            type: "CURRENT",
            home: "1",
            away: "2",
          },
        },
      },
    });
  });
});
