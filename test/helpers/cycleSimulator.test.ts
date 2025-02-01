import { describe, expect, it } from "vitest";
import CycleSimulator from "./cycleSimulator";
import { RawModel } from "../../src/models";

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

  it("should throw error when event is not found", () => {
    const simulator = new CycleSimulator();
    expect(() => simulator.findEvent("non-existent-event-id")).toThrow("Event with id non-existent-event-id not found");
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

    // should have all needed mappings
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

    // start Real Madrid vs Barcelona match
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

    // start Legia Warsaw vs Bayern Munich match
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

    // Lewandowski scores the opening goal to make it 0-1
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

    // Lewandowski scores a goal to make it 0-2
    simulator.score(eventId1, "away", 1);
    state = simulator.getCurrentState();
    expect(state[0].scores).toMatchObject<Partial<RawModel.PeriodScore>[]>([
      { periodId: "period_current", homeScore: "0", awayScore: "2" },
      { periodId: "period_1", homeScore: "0", awayScore: "2" },
    ]);

    // start second half of Real Madrid vs Barcelona match
    simulator.startNewPeriod(eventId1);
    state = simulator.getCurrentState();
    expect(state).toMatchObject<Partial<RawModel.SportEvent>[]>([
      {
        id: eventId1,
        status: "status_live",
        scores: [
          { periodId: "period_current", homeScore: "0", awayScore: "2" },
          { periodId: "period_1", homeScore: "0", awayScore: "2" },
          { periodId: "period_2", homeScore: "0", awayScore: "0" },
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

    // Lewandowski scores a hat-trick to make it 0-3
    simulator.score(eventId1, "away");
    state = simulator.getCurrentState();
    expect(state[0].scores).toMatchObject<Partial<RawModel.PeriodScore>[]>([
      { periodId: "period_current", homeScore: "0", awayScore: "3" },
      { periodId: "period_1", homeScore: "0", awayScore: "2" },
      { periodId: "period_2", homeScore: "0", awayScore: "1" },
    ]);

    // start second half of Legia vs Bayern match
    simulator.startNewPeriod(eventId2);
    state = simulator.getCurrentState();
    expect(state[1].scores).toMatchObject<Partial<RawModel.PeriodScore>[]>([
      { periodId: "period_current", homeScore: "0", awayScore: "0" },
      { periodId: "period_1", homeScore: "0", awayScore: "0" },
      { periodId: "period_2", homeScore: "0", awayScore: "0" },
    ]);

    // end match Real Madrid vs Barcelona
    simulator.endMatch(eventId1);
    state = simulator.getCurrentState();
    expect(state[0]).toMatchObject<Partial<RawModel.SportEvent>>({
      id: eventId1,
      status: "status_removed",
      scores: [
        { periodId: "period_current", homeScore: "0", awayScore: "3" },
        { periodId: "period_1", homeScore: "0", awayScore: "2" },
        { periodId: "period_2", homeScore: "0", awayScore: "1" },
      ],
    });
  });
});
