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
    const simulator = new CycleSimulator();
    simulator
      .withFootballTeam("barcelona")
      .withFootballTeam("realMadrid")
      .withFootballTeam("bayernMunich")
      .withFootballTeam("legiaWarsaw");

    simulator
      .withEvent("1", "", "football", "championsLeague", "realMadrid", "barcelona")
      .withEvent("2", "", "football", "championsLeague", "legiaWarsaw", "bayernMunich");

    const state = simulator.getCurrentState();
    expect(state).toMatchObject<RawModel.SportEvent[]>([
      {
        id: "1",
        sportId: "football",
        competitionId: "championsLeague",
        status: "PRE",
        homeCompetitorId: "realMadrid",
        awayCompetitorId: "barcelona",
        startTime: "0",
        scores: [],
      },
      {
        id: "2",
        sportId: "football",
        competitionId: "championsLeague",
        status: "PRE",
        homeCompetitorId: "legiaWarsaw",
        awayCompetitorId: "bayernMunich",
        startTime: "0",
        scores: [],
      },
    ]);

    // simulator.startMatch();
  });
});
