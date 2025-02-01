import { beforeEach, describe, expect, it } from "vitest";
import { updateState, geAllEvents, getActiveEvents, clearState } from "../../src/services/stateManager";
import { RawModel } from "../../src/models";
import CycleSimulator from "../helpers/cycleSimulator";

const matchRealVsBarcelonaId = "11";
const matchBayernVsPSGId = "12";
const matchliverpoolVsMilanId = "13";

const matchChicagoVsBostonId = "21";
const matchLakersVsMiamiId = "22";

const createFootballSimulation = () => {
  return new CycleSimulator()
    .withFootballTeam("realMadrid")
    .withFootballTeam("barcelona")
    .withFootballTeam("bayernMunich")
    .withFootballTeam("parisSaintGermain")
    .withFootballTeam("liverpool")
    .withFootballTeam("acMilan")

    .withEvent(matchRealVsBarcelonaId, "1735690200000", "football", "championsLeague", "realMadrid", "barcelona")
    .withEvent(matchBayernVsPSGId, "1735690200000", "football", "championsLeague", "bayernMunich", "parisSaintGermain")
    .withEvent(matchliverpoolVsMilanId, "1735690200000", "football", "championsLeague", "liverpool", "acMilan");
};

const createBasketballSimulation = () => {
  return new CycleSimulator()
    .withBasketballTeam("chicagoBulls")
    .withBasketballTeam("bostonCeltics")
    .withBasketballTeam("laLakers")
    .withBasketballTeam("miamiHeat")
    .withEvent(matchChicagoVsBostonId, "1735690200000", "basketball", "nba", "chicagoBulls", "bostonCeltics")
    .withEvent(matchLakersVsMiamiId, "1735690200000", "basketball", "nba", "laLakers", "miamiHeat");
};

describe("StateManager", () => {
  let simulationFootball: CycleSimulator;
  let simulationBasketball: CycleSimulator;

  beforeEach(() => {
    simulationFootball = createFootballSimulation();
    simulationBasketball = createBasketballSimulation();
    clearState();
  });

  it("should update the state correctly", () => {
    const mappings = simulationFootball.getMappings();

    // pre-start state
    const eventsUpdate1 = simulationFootball.getCurrentState();

    updateState(eventsUpdate1, mappings);
    let state = geAllEvents();

    expect(Object.keys(state).length).toEqual(eventsUpdate1.length);
    expect(state[matchRealVsBarcelonaId]).toEqual({
      id: matchRealVsBarcelonaId,
      sport: "FOOTBALL",
      competition: "Champions League",
      startTime: "2025-01-01T00:10:00.000Z",
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
      status: "PRE",
      scores: {},
    });

    // start match of event11
    simulationFootball.startMatch(matchRealVsBarcelonaId);
    const eventsUpdate2 = simulationFootball.getCurrentState();

    updateState(eventsUpdate2, mappings);
    state = geAllEvents();

    expect(state[matchRealVsBarcelonaId].status).toEqual("LIVE");
    expect(state[matchRealVsBarcelonaId].scores).toEqual({
      CURRENT: { type: "CURRENT", home: "0", away: "0" },
      PERIOD_1: { type: "PERIOD_1", home: "0", away: "0" },
    });

    // home scores 1-0
    simulationFootball.score(matchRealVsBarcelonaId, "home", 1);
    const eventsUpdate3 = simulationFootball.getCurrentState();

    updateState(eventsUpdate3, mappings);
    state = geAllEvents();

    expect(state[matchRealVsBarcelonaId].scores).toEqual({
      CURRENT: { type: "CURRENT", home: "1", away: "0" },
      PERIOD_1: { type: "PERIOD_1", home: "1", away: "0" },
    });

    // finish first half
    simulationFootball.startNewPeriod(matchRealVsBarcelonaId);
    const eventsUpdate4 = simulationFootball.getCurrentState();

    updateState(eventsUpdate4, mappings);
    state = geAllEvents();

    expect(state[matchRealVsBarcelonaId].scores).toEqual({
      CURRENT: { type: "CURRENT", home: "1", away: "0" },
      PERIOD_1: { type: "PERIOD_1", home: "1", away: "0" },
      PERIOD_2: { type: "PERIOD_2", home: "0", away: "0" },
    });

    // away scores 1-1
    simulationFootball.score(matchRealVsBarcelonaId, "away");
    const eventsUpdate5 = simulationFootball.getCurrentState();

    updateState(eventsUpdate5, mappings);
    state = geAllEvents();

    expect(state[matchRealVsBarcelonaId].scores).toEqual({
      CURRENT: { type: "CURRENT", home: "1", away: "1" },
      PERIOD_1: { type: "PERIOD_1", home: "1", away: "0" },
      PERIOD_2: { type: "PERIOD_2", home: "0", away: "1" },
    });
  });

  it("should mark events as REMOVED when they are no longer in updates", () => {
    const mappings = simulationFootball.getMappings();

    simulationFootball.startMatch(matchRealVsBarcelonaId);
    simulationFootball.startMatch(matchBayernVsPSGId);
    simulationFootball.startMatch(matchliverpoolVsMilanId);

    // initial state - all events are active
    updateState(simulationFootball.getCurrentState(), mappings);
    expect(Object.keys(getActiveEvents())).toEqual([
      matchRealVsBarcelonaId,
      matchBayernVsPSGId,
      matchliverpoolVsMilanId,
    ]);

    // finish one event12
    simulationFootball.removeEvent(matchBayernVsPSGId);
    updateState(simulationFootball.getCurrentState(), mappings);

    // verify state after ending one event
    const expectedActiveEvents = [matchRealVsBarcelonaId, matchliverpoolVsMilanId];
    expect(Object.keys(getActiveEvents())).toEqual(expectedActiveEvents);

    // verify ended event is still in state but marked as REMOVED
    expect(Object.keys(geAllEvents())).toEqual([matchRealVsBarcelonaId, matchBayernVsPSGId, matchliverpoolVsMilanId]);
    expect(geAllEvents()[matchBayernVsPSGId].status).toEqual("REMOVED");
  });

  it("should clear all events when clearState is called", () => {
    const mappings = simulationFootball.getMappings();

    simulationFootball.startMatch(matchRealVsBarcelonaId);
    simulationFootball.startMatch(matchBayernVsPSGId);
    simulationFootball.startMatch(matchliverpoolVsMilanId);

    updateState(simulationFootball.getCurrentState(), mappings);
    expect(Object.keys(geAllEvents())).toEqual([matchRealVsBarcelonaId, matchBayernVsPSGId, matchliverpoolVsMilanId]);

    clearState();
    expect(Object.keys(geAllEvents())).toEqual([]);
  });

  it("should clear the state when mappings change", () => {
    updateState(simulationFootball.getCurrentState(), simulationFootball.getMappings());
    expect(Object.keys(geAllEvents())).toEqual([matchRealVsBarcelonaId, matchBayernVsPSGId, matchliverpoolVsMilanId]);

    // switch to new mappings - should clear previous state
    updateState(simulationBasketball.getCurrentState(), simulationBasketball.getMappings());
    expect(Object.keys(geAllEvents())).toEqual([matchChicagoVsBostonId, matchLakersVsMiamiId]);
  });
});
