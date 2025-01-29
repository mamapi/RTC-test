import { MappingDictionary, SportEventOdd } from "./parser";
import { mapSportEvents, SportEvent } from "./mapper";

let internalState: Record<string, SportEvent> = {};

export const updateState = (odds: SportEventOdd[], mappings: MappingDictionary) => {
  const sportEvents = mapSportEvents(odds, mappings);
  for (const [key, value] of Object.entries(sportEvents)) {
    internalState[key] = value;
  }

  for (const key in internalState) {
    if (!Object.keys(sportEvents).some((id) => id === key)) {
      internalState[key].status = "REMOVED";
    }
  }
};

export const geAllEvents = () => internalState;

export const getActiveEvents = () =>
  Object.fromEntries(Object.entries(internalState).filter(([_, event]) => event.status !== "REMOVED"));
