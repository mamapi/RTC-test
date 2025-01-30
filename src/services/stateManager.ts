import { MappingDictionary, SportEventOdd } from "./parser";
import { mapSportEvents, SportEvent } from "./mapper";

let internalState: Record<string, SportEvent> = {};

export const updateState = (odds: SportEventOdd[], mappings: MappingDictionary) => {
  const sportEvents = mapSportEvents(odds, mappings);

  // Update and add new events
  Object.assign(internalState, sportEvents);

  // Mark removed events
  const newEventIds = new Set(Object.keys(sportEvents));
  Object.keys(internalState)
    .filter((key) => !newEventIds.has(key))
    .forEach((key) => {
      internalState[key].status = "REMOVED";
    });
};

export const clearState = () => {
};

export const geAllEvents = () => internalState;

export const getActiveEvents = () =>
  Object.fromEntries(Object.entries(internalState).filter(([_, event]) => event.status !== "REMOVED"));
