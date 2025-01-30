import { beforeEach, describe, expect, it } from "vitest";
import { MappingDictionary, SportEventOdd } from "../../src/services/parser";
import { updateState, geAllEvents, getActiveEvents, clearState } from "../../src/services/stateManager";

const mappings1: MappingDictionary = {
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
  period0: "CURRENT",
  period1: "PERIOD_1",
  period2: "PERIOD_2",
};

const mappings2: MappingDictionary = {
  event1: "event1",
  event2: "event2",
  sport1: "BASKETBALL",
  competition1: "NBA",
  home1: "Lakers",
  away1: "Warriors",
  status0: "PRE",
  status1: "LIVE",
  period0: "CURRENT",
  period1: "PERIOD_1",
  period2: "PERIOD_2",
};

const event1Data = {
  id: "event1",
  sportId: "sport1",
  competitionId: "competition1",
  startTime: "1735690200000",
  homeCompetitorId: "home1",
  awayCompetitorId: "away1",
  status: "status1",
};

const event1Update1: SportEventOdd = {
  ...event1Data,
  scores: [
    {
      periodId: "period0",
      homeScore: "1",
      awayScore: "2",
    },
  ],
};

const event1Update2: SportEventOdd = {
  ...event1Data,
  scores: [
    {
      periodId: "period0",
      homeScore: "3",
      awayScore: "4",
    },
  ],
};

const event2Data = {
  id: "event2",
  sportId: "sport1",
  competitionId: "competition1",
  startTime: "1735690200000",
  homeCompetitorId: "home2",
  awayCompetitorId: "away2",
  status: "status0",
};

const event2Update1: SportEventOdd = {
  ...event2Data,
  scores: [
    {
      periodId: "period0",
      homeScore: "3",
      awayScore: "4",
    },
  ],
};

describe("StateManager", () => {
  beforeEach(() => {
    clearState();
  });

  it("should update the state correctly", () => {
    updateState([event1Update1], mappings1);

    const state = geAllEvents();
    expect(state).toEqual({
      event1: {
        id: "event1",
        status: "LIVE",
        startTime: "2025-01-01T00:10:00.000Z",
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

    updateState([event1Update2], mappings1);

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
    updateState([event1Update1, event2Update1], mappings1);
    expect(Object.keys(getActiveEvents())).toEqual(["event1", "event2"]);

    updateState([event2Update1], mappings1);
    expect(Object.keys(getActiveEvents())).toEqual(["event2"]);
    expect(Object.keys(geAllEvents())).toEqual(["event1", "event2"]);
    expect(geAllEvents().event1.status).toEqual("REMOVED");
  });

  it("should clear all events when clearState is called", () => {
    updateState([event1Update1], mappings1);
    expect(Object.keys(geAllEvents())).toEqual(["event1"]);

    clearState();
    expect(Object.keys(geAllEvents())).toEqual([]);
  });

  it("should clear the state when mappings change", () => {
    updateState([event1Update1], mappings1);
    expect(Object.keys(geAllEvents())).toEqual(["event1"]);

    updateState([event1Update2], mappings1);
    expect(Object.keys(geAllEvents())).toEqual(["event1"]);

    // switch to new mappings - should clear previous state
    updateState([event2Update1], mappings2);
    expect(Object.keys(geAllEvents())).toEqual(["event2"]);
  });
});
