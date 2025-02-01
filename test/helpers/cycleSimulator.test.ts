import { describe, expect, it } from "vitest";
import CycleSimulator from "./cycleSimulator";

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
});
