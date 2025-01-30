import { describe, expect, it } from "vitest";
import { RawModel } from "../../src/models";
import { mapSportEvents, SportEvents } from "../../src/services/mapper";

describe("Mapper", () => {
  it("should map the sport events correctly", () => {
    const odds: RawModel.SportEventOdd[] = [
      {
        id: "event1",
        sportId: "sport1",
        competitionId: "competition1",
        startTime: "1709900432183",
        homeCompetitorId: "competitor1",
        awayCompetitorId: "competitor2",
        status: "status1",
        scores: [
          {
            periodId: "period1",
            homeScore: "1",
            awayScore: "2",
          },
          {
            periodId: "period0",
            homeScore: "3",
            awayScore: "4",
          },
        ],
      },
    ];
    const mappings: RawModel.MappingDictionary = {
      competitor1: "Real Madrid",
      competitor2: "Barcelona",
      status1: "LIVE",
      sport1: "FOOTBALL",
      competition1: "La Liga",
      period0: "CURRENT",
      period1: "PERIOD_1",
    };

    const sportEvents = mapSportEvents(odds, mappings);

    expect(sportEvents).toEqual<SportEvents>({
      event1: {
        id: "event1",
        status: "LIVE",
        scores: {
          CURRENT: { type: "CURRENT", home: "3", away: "4" },
          PERIOD_1: { type: "PERIOD_1", home: "1", away: "2" },
        },
        startTime: "2024-03-08T12:20:32.183Z",
        sport: "FOOTBALL",
        competition: "La Liga",
        competitors: {
          HOME: { type: "HOME", name: "Real Madrid" },
          AWAY: { type: "AWAY", name: "Barcelona" },
        },
      },
    });
  });
});
