import { describe, expect, it } from "vitest";
import { MappingDictionary, SportEventOdd } from "../../src/services/parser";
import { updateState, geAllEvents, getActiveEvents } from "../../src/services/stateManager";

const mappings: MappingDictionary = {
  event1: "event1",
  event2: "event2",
  sport1: "FOOTBALL",
  competition1: "LALIGA",
  home1: "Real Madrid",
  away1: "Barcelona",
  home2: "Valencia",
  away2: "Atletico Madrid",
  status0: "PRE",
  status1: "LIVE",
};

const event1Data = {
  id: "event1",
  sportId: "sport1",
  competitionId: "competition1",
  startTime: "1",
  homeCompetitorId: "home1",
  awayCompetitorId: "away1",
  status: "status1",
};

const event1Update1: SportEventOdd = {
  ...event1Data,
  scores: [
    {
      periodId: "CURRENT",
      homeScore: "1",
      awayScore: "2",
    },
  ],
};

const event1Update2: SportEventOdd = {
  ...event1Data,
  scores: [
    {
      periodId: "CURRENT",
      homeScore: "3",
      awayScore: "4",
    },
  ],
};

const event2Data = {
  id: "event2",
  sportId: "sport1",
  competitionId: "competition1",
  startTime: "1",
  homeCompetitorId: "home2",
  awayCompetitorId: "away2",
  status: "status0",
};

const event2Update1: SportEventOdd = {
  ...event2Data,
  scores: [
    {
      periodId: "CURRENT",
      homeScore: "3",
      awayScore: "4",
    },
  ],
};

describe("StateManager", () => {
  it("should update the state correctly", () => {
    updateState([event1Update1], mappings);

    const state = geAllEvents();
    expect(state).toEqual({
      event1: {
        id: "event1",
        status: "LIVE",
        startTime: "1",
        sport: "FOOTBALL",
        competition: "LALIGA",
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

    updateState([event1Update2], mappings);

    expect(getActiveEvents()).toEqual({
      event1: {
        ...state.event1,
        scores: {
          CURRENT: {
            type: "CURRENT",
            home: "3",
            away: "4",
          },
        },
      },
    });
  });

  it("should not return the event from the state if it is not in the updates", () => {
    updateState([event1Update1, event2Update1], mappings);
    expect(Object.keys(getActiveEvents())).toEqual(["event1", "event2"]);

    updateState([event2Update1], mappings);
    expect(Object.keys(getActiveEvents())).toEqual(["event2"]);
    expect(Object.keys(geAllEvents())).toEqual(["event1", "event2"]);
    expect(geAllEvents().event1.status).toEqual("REMOVED");
  });

  it("should clear all events when clearState is called", () => {
    updateState([event1Update1], mappings);
    expect(Object.keys(geAllEvents())).toEqual(["event1"]);

    clearState();
    expect(Object.keys(geAllEvents())).toEqual([]);
  });
});
