import { beforeEach, describe, expect, it } from "vitest";
import { updateState, geAllEvents, getActiveEvents, clearState } from "../../src/services/stateManager";
import { RawModel } from "../../src/models";

interface Cycle {
  mappings: RawModel.MappingDict;
  events: {
    [eventId: string]: {
      data: Omit<RawModel.SportEvent, "scores">;
      updates: RawModel.PeriodScore[];
    };
  };
}

const cycle1: Cycle = {
  mappings: {
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
  },
  events: {
    "11": {
      data: {
        id: "11",
        sportId: "sport1",
        competitionId: "competition1",
        startTime: "1735690200000",
        homeCompetitorId: "home1",
        awayCompetitorId: "away1",
        status: "status1",
      },
      updates: [
        {
          periodId: "period0",
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
    "12": {
      data: {
        id: "12",
        sportId: "sport1",
        competitionId: "competition1",
        startTime: "1735690200000",
        homeCompetitorId: "home2",
        awayCompetitorId: "away2",
        status: "status0",
      },
      updates: [
        {
          periodId: "period0",
          homeScore: "0",
          awayScore: "0",
        },
        {
          periodId: "period0",
          homeScore: "0",
          awayScore: "1",
        },
      ],
    },
  },
};

const cycle2: Cycle = {
  mappings: {
    event1: "event1",
    event2: "event2",
    sport2: "BASKETBALL",
    competition2: "NBA",
    home2: "Lakers",
    away2: "Warriors",
    status0: "PRE",
    status1: "LIVE",
    period0: "CURRENT",
    period1: "PERIOD_1",
    period2: "PERIOD_2",
  },
  events: {
    "21": {
      data: {
        id: "21",
        sportId: "sport2",
        competitionId: "competition2",
        startTime: "1735690200000",
        homeCompetitorId: "home2",
        awayCompetitorId: "away2",
        status: "status0",
      },
      updates: [
        {
          periodId: "period0",
          homeScore: "3",
          awayScore: "4",
        },
      ],
    },
  },
};

const getEventUpdate = (cycle: Cycle, eventId: string, updateIndex: number) => ({
  ...cycle.events[eventId].data,
  scores: [cycle.events[eventId].updates[updateIndex]],
});

describe("StateManager", () => {
  beforeEach(() => {
    clearState();
  });

  it("should update the state correctly", () => {
    const { mappings } = cycle1;

    // first update
    const eventUpdate1 = getEventUpdate(cycle1, "11", 0);
    updateState([eventUpdate1], mappings);

    const state = geAllEvents();
    expect(state).toMatchObject({
      "11": {
        scores: {
          CURRENT: {
            type: "CURRENT",
            home: "1",
            away: "2",
          },
        },
      },
    });

    // second update
    const eventUpdate2 = getEventUpdate(cycle1, "11", 1);
    updateState([eventUpdate2], mappings);

    expect(getActiveEvents()).toMatchObject({
      "11": {
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
    const { mappings } = cycle1;

    const event1Update1 = getEventUpdate(cycle1, "11", 0);
    const event2Update1 = getEventUpdate(cycle1, "12", 0);

    updateState([event1Update1, event2Update1], mappings);
    expect(Object.keys(getActiveEvents())).toEqual(["11", "12"]);

    updateState([event1Update1], mappings);
    expect(Object.keys(getActiveEvents())).toEqual(["11"]);
    expect(Object.keys(geAllEvents())).toEqual(["11", "12"]);
    expect(geAllEvents()["12"].status).toEqual("REMOVED");
  });

  it("should clear all events when clearState is called", () => {
    const { mappings } = cycle1;

    const eventUpdate1 = getEventUpdate(cycle1, "11", 0);
    updateState([eventUpdate1], mappings);
    expect(Object.keys(geAllEvents())).toEqual(["11"]);

    clearState();
    expect(Object.keys(geAllEvents())).toEqual([]);
  });

  it("should clear the state when mappings change", () => {
    const event11Update0 = getEventUpdate(cycle1, "11", 0);
    updateState([event11Update0], cycle1.mappings);
    expect(Object.keys(geAllEvents())).toEqual(["11"]);

    const event11Update1 = getEventUpdate(cycle1, "11", 1);
    updateState([event11Update1], cycle1.mappings);
    expect(Object.keys(geAllEvents())).toEqual(["11"]);

    // switch to new mappings - should clear previous state
    const event21Update0 = getEventUpdate(cycle2, "21", 0);
    updateState([event21Update0], cycle2.mappings);
    expect(Object.keys(geAllEvents())).toEqual(["21"]);
  });
});
