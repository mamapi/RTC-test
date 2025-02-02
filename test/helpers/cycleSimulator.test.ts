import { beforeAll, describe, expect, it } from "vitest";
import CycleSimulator from "./cycleSimulator";
import { RawModel } from "../../src/models";

const createFootballSimulator = () => {
  return new CycleSimulator()
    .withFootballTeam("barcelona")
    .withFootballTeam("realMadrid")
    .withFootballTeam("bayernMunich")
    .withFootballTeam("legiaWarsaw");
};

const createBasketballSimulator = () => {
  return new CycleSimulator()
    .withBasketballTeam("laLakers")
    .withBasketballTeam("bostonCeltics")
    .withBasketballTeam("chicagoBulls")
    .withBasketballTeam("miamiHeat");
};

const setupTestFootballMatches = (simulator: CycleSimulator) => {
  const matchIds = {
    elClasico: "1",
    legiaVsBayern: "2",
  };

  simulator
    .withEvent(matchIds.elClasico, "0", "football", "championsLeague", "realMadrid", "barcelona")
    .withEvent(matchIds.legiaVsBayern, "0", "football", "championsLeague", "legiaWarsaw", "bayernMunich");

  return matchIds;
};

describe("Sport Events Cycle Simulator", () => {
  it("ctor should initialize with default mappings", () => {
    const simulator = new CycleSimulator();
    expect(simulator.getMappings()).toStrictEqual({
      status_pre: "PRE",
      status_live: "LIVE",
      status_removed: "REMOVED",
      period_current: "CURRENT",
      period_1: "PERIOD_1",
      period_2: "PERIOD_2",
      period_3: "PERIOD_3",
      period_4: "PERIOD_4",
    });
  });

  it("should return mappings with football teams", () => {
    const simulator = createFootballSimulator();
    expect(simulator.getMappings()).toMatchObject({
      football: "FOOTBALL",
      barcelona: "Barcelona",
      realMadrid: "Real Madrid",
      bayernMunich: "Bayern Munich",
      legiaWarsaw: "Legia Warsaw",
    });
  });

  it("should return mappings with basketball teams", () => {
    const simulator = createBasketballSimulator();
    expect(simulator.getMappings()).toMatchObject({
      basketball: "BASKETBALL",
      laLakers: "Los Angeles Lakers",
      bostonCeltics: "Boston Celtics",
      chicagoBulls: "Chicago Bulls",
      miamiHeat: "Miami Heat",
    });
  });

  it("should throw error when event is not found", () => {
    const simulator = new CycleSimulator();
    expect(() => simulator.findEvent("non-existent-event-id")).toThrow("Event with id non-existent-event-id not found");
  });

  describe("Football matches simulation - Continuous flow", () => {
    let simulator: CycleSimulator;
    let matchIds: { elClasico: string; legiaVsBayern: string };

    beforeAll(() => {
      simulator = createFootballSimulator();
      matchIds = setupTestFootballMatches(simulator);
    });

    it("should have all needed mappings", () => {
      expect(simulator.getMappings()).toMatchObject({
        status_pre: "PRE",
        status_live: "LIVE",
        status_removed: "REMOVED",
        period_current: "CURRENT",
        period_1: "PERIOD_1",
        period_2: "PERIOD_2",
        period_3: "PERIOD_3",
        period_4: "PERIOD_4",

        football: "FOOTBALL",
        championsLeague: "Champions League",
        barcelona: "Barcelona",
        realMadrid: "Real Madrid",
        bayernMunich: "Bayern Munich",
        legiaWarsaw: "Legia Warsaw",
      });
    });

    it("1. should start in PRE state", () => {
      const initialState = simulator.getCurrentState();
      expect(initialState).toMatchObject<RawModel.SportEvent[]>([
        {
          id: matchIds.elClasico,
          sportId: "football",
          competitionId: "championsLeague",
          status: "status_pre",
          homeCompetitorId: "realMadrid",
          awayCompetitorId: "barcelona",
          startTime: "0",
          scores: [],
        },
        {
          id: matchIds.legiaVsBayern,
          sportId: "football",
          competitionId: "championsLeague",
          status: "status_pre",
          homeCompetitorId: "legiaWarsaw",
          awayCompetitorId: "bayernMunich",
          startTime: "0",
          scores: [],
        },
      ]);
    });

    it("2. should start El Clasico match", () => {
      simulator.startMatch(matchIds.elClasico);

      const state = simulator.getCurrentState();
      expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
        {
          id: matchIds.elClasico,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "0" },
            { periodId: "period_1", homeScore: "0", awayScore: "0" },
          ],
        },
        {
          id: matchIds.legiaVsBayern,
          status: "status_pre",
          scores: [],
        },
      ]);
    });

    it("3. should handle Lewandowski scoring first goal", () => {
      simulator.score(matchIds.elClasico, "away", 1);

      const state = simulator.getCurrentState();
      expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
        {
          id: matchIds.elClasico,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "1" },
            { periodId: "period_1", homeScore: "0", awayScore: "1" },
          ],
        },
        {
          id: matchIds.legiaVsBayern,
          status: "status_pre",
          scores: [],
        },
      ]);
    });

    it("4. should start Legia vs Bayern match", () => {
      simulator.startMatch(matchIds.legiaVsBayern);

      const state = simulator.getCurrentState();
      expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
        {
          id: matchIds.elClasico,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "1" },
            { periodId: "period_1", homeScore: "0", awayScore: "1" },
          ],
        },
        {
          id: matchIds.legiaVsBayern,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "0" },
            { periodId: "period_1", homeScore: "0", awayScore: "0" },
          ],
        },
      ]);
    });

    it("5. should handle Lewandowski scoring to make it 0-2", () => {
      simulator.score(matchIds.elClasico, "away", 1);

      const state = simulator.getCurrentState();
      expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
        {
          id: matchIds.elClasico,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "2" },
            { periodId: "period_1", homeScore: "0", awayScore: "2" },
          ],
        },
        {
          id: matchIds.legiaVsBayern,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "0" },
            { periodId: "period_1", homeScore: "0", awayScore: "0" },
          ],
        },
      ]);
    });

    it("6. should start El Clasico second half with 0-0 and current score 0-2", () => {
      simulator.startNewPeriod(matchIds.elClasico);

      const state = simulator.getCurrentState();
      expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
        {
          id: matchIds.elClasico,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "2" },
            { periodId: "period_1", homeScore: "0", awayScore: "2" },
            { periodId: "period_2", homeScore: "0", awayScore: "0" },
          ],
        },
        {
          id: matchIds.legiaVsBayern,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "0" },
            { periodId: "period_1", homeScore: "0", awayScore: "0" },
          ],
        },
      ]);
    });

    it("7. should handle Lewandowski scores a hat-trick to make it 0-3", () => {
      simulator.score(matchIds.elClasico, "away", 1);

      const state = simulator.getCurrentState();
      expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
        {
          id: matchIds.elClasico,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "3" },
            { periodId: "period_1", homeScore: "0", awayScore: "2" },
            { periodId: "period_2", homeScore: "0", awayScore: "1" },
          ],
        },
        {
          id: matchIds.legiaVsBayern,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "0" },
            { periodId: "period_1", homeScore: "0", awayScore: "0" },
          ],
        },
      ]);
    });

    it("8. should end El Clasico match", () => {
      simulator.endMatch(matchIds.elClasico);

      const state = simulator.getCurrentState();
      expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
        {
          id: matchIds.elClasico,
          status: "status_removed",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "3" },
            { periodId: "period_1", homeScore: "0", awayScore: "2" },
            { periodId: "period_2", homeScore: "0", awayScore: "1" },
          ],
        },
        {
          id: matchIds.legiaVsBayern,
          status: "status_live",
          scores: [
            { periodId: "period_current", homeScore: "0", awayScore: "0" },
            { periodId: "period_1", homeScore: "0", awayScore: "0" },
          ],
        },
      ]);
    });
  });

  describe("Basketball matches simulation", () => {
    it("should simulate single competition cycle", () => {
      const eventId1 = "1";
      const simulator = createBasketballSimulator();
    });
  });
});
