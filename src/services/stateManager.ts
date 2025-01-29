import { MappingDictionary, SportEventOdd } from "./parser";
import { mapSportEvents, SportEvent } from "./mapper";

let internalState: Record<string, SportEvent> = {};

export const updateState = (odds: SportEventOdd[], mappings: MappingDictionary) => {
  const sportEvents = mapSportEvents(odds, mappings);
  for (const [key, value] of Object.entries(sportEvents)) {
    internalState[key] = value;
  }
};

export const geAllEvents = () => internalState;

export const getActiveEvents = () => internalState;
