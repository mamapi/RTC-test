import { MappingDictionary, SportEventOdd } from "./parser";
import { mapSportEvents, SportEvent } from "./mapper";

let internalState: Record<string, SportEvent> = {};

export const updateState = (odds: SportEventOdd[], mappings: MappingDictionary) => {
  const sportEvents = mapSportEvents(odds, mappings);
  internalState = sportEvents;
};

export const getState = () => internalState;
