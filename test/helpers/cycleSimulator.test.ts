import { describe, expect, it } from "vitest";
import CycleSimulator from "./cycleSimulator";
import { RawModel } from "../../src/models";

describe("Sport Events Cycle Simulator", () => {
  it("ctor should initialize with default mappings", () => {
    const simulator = new CycleSimulator();
    expect(simulator.getMappings()).toStrictEqual({
      status_pre: "PRE",
      status_live: "LIVE",
      period_current: "CURRENT",
      period_1: "PERIOD_1",
      period_2: "PERIOD_2",
      period_3: "PERIOD_3",
      period_4: "PERIOD_4",
    });
  });

  it("should return mappings with football teams", () => {
    const simulator = new CycleSimulator();
    simulator
      .withFootballTeam("barcelona")
      .withFootballTeam("realMadrid")
      .withFootballTeam("bayernMunich")
      .withFootballTeam("legiaWarsaw");
    expect(simulator.getMappings()).toMatchObject({
      football: "FOOTBALL",
      barcelona: "Barcelona",
      realMadrid: "Real Madrid",
      bayernMunich: "Bayern Munich",
      legiaWarsaw: "Legia Warsaw",
    });
  });

  it("should return mappings with basketball teams", () => {
    const simulator = new CycleSimulator();
    simulator
      .withBasketballTeam("laLakers")
      .withBasketballTeam("bostonCeltics")
      .withBasketballTeam("chicagoBulls")
      .withBasketballTeam("miamiHeat");
    expect(simulator.getMappings()).toMatchObject({
      basketball: "BASKETBALL",
      laLakers: "Los Angeles Lakers",
      bostonCeltics: "Boston Celtics",
      chicagoBulls: "Chicago Bulls",
      miamiHeat: "Miami Heat",
    });
  });

  it("should simulate single competition cycle", () => {
    const eventId1 = "1";
    const eventId2 = "2";
    const simulator = new CycleSimulator();
    simulator
      .withFootballTeam("barcelona")
      .withFootballTeam("realMadrid")
      .withFootballTeam("bayernMunich")
      .withFootballTeam("legiaWarsaw");

    simulator
      .withEvent(eventId1, "0", "football", "championsLeague", "realMadrid", "barcelona")
      .withEvent(eventId2, "0", "football", "championsLeague", "legiaWarsaw", "bayernMunich");

    // pre-match state
    let state = simulator.getCurrentState();
    expect(state).toMatchObject<RawModel.SportEvent[]>([
      {
        id: eventId1,
        sportId: "football",
        competitionId: "championsLeague",
        status: "status_pre",
        homeCompetitorId: "realMadrid",
        awayCompetitorId: "barcelona",
        startTime: "0",
        scores: [],
      },
      {
        id: eventId2,
        sportId: "football",
        competitionId: "championsLeague",
        status: "status_pre",
        homeCompetitorId: "legiaWarsaw",
        awayCompetitorId: "bayernMunich",
        startTime: "0",
        scores: [],
      },
    ]);

    // start realMadrid vs barcelona match
    simulator.startMatch(eventId1);
    state = simulator.getCurrentState();
    expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
      {
        id: eventId1,
        status: "status_live",
        scores: [
          { periodId: "period_current", homeScore: "0", awayScore: "0" },
          { periodId: "period_1", homeScore: "0", awayScore: "0" },
        ],
      },
      {
        id: eventId2,
        status: "status_pre",
        scores: [],
      },
    ]);

    // start legiaWarsaw vs bayernMunich match
    simulator.startMatch(eventId2);
    state = simulator.getCurrentState();
    expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
      {
        id: eventId1,
        status: "status_live",
        scores: [
          { periodId: "period_current", homeScore: "0", awayScore: "0" },
          { periodId: "period_1", homeScore: "0", awayScore: "0" },
        ],
      },
      {
        id: eventId2,
        status: "status_live",
        scores: [
          { periodId: "period_current", homeScore: "0", awayScore: "0" },
          { periodId: "period_1", homeScore: "0", awayScore: "0" },
        ],
      },
    ]);

    // score Lewandowski to 1-0
    simulator.score(eventId1, "away", 1);
    state = simulator.getCurrentState();
    expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
      {
        id: eventId1,
        status: "status_live",
        scores: [
          { periodId: "period_current", homeScore: "0", awayScore: "1" },
          { periodId: "period_1", homeScore: "0", awayScore: "1" },
        ],
      },
      {
        id: eventId2,
        status: "status_live",
        scores: [
          { periodId: "period_current", homeScore: "0", awayScore: "0" },
          { periodId: "period_1", homeScore: "0", awayScore: "0" },
        ],
      },
    ]);

    // score Lewandowski to 2-0
    simulator.score(eventId1, "away", 1);
    state = simulator.getCurrentState();
    expect(state[0].scores).toMatchObject<Partial<RawModel.PeriodScore>[]>([
      {
        periodId: "period_current",
        homeScore: "0",
        awayScore: "2",
      },
      {
        periodId: "period_1",
        homeScore: "0",
        awayScore: "2",
      },
    ]);

  });
});
