import { RawModel, SportEventModel } from "../models";
import { mapSportEvents } from "./mapper";

let internalState: Record<string, SportEventModel.SportEvent> = {};
let currentMappingsHash: string = "";

export const updateState = (events: RawModel.SportEvent[], mappings: RawModel.MappingDict) => {
  const [mappingsChanged, newMappingsHash] = hashMappingsChanged(mappings);
  if (mappingsChanged) {
    clearState();
    currentMappingsHash = newMappingsHash;
  }

  const sportEvents = mapSportEvents(events, mappings);
  updateEvents(sportEvents);
  markRemovedEvents(sportEvents);
};

export const clearState = () => {
  internalState = {};
};

export const geAllEvents = () => internalState;

export const getActiveEvents = () =>
  Object.fromEntries(Object.entries(internalState).filter(([_, event]) => event.status !== "REMOVED"));

const hashMappingsChanged = (mappings: RawModel.MappingDict): [boolean, string] => {
  const newHash = JSON.stringify(mappings);
  return [newHash !== currentMappingsHash, newHash];
};

const updateEvents = (events: Record<string, SportEventModel.SportEvent>) => {
  Object.assign(internalState, events);
};

const markRemovedEvents = (events: Record<string, SportEventModel.SportEvent>) => {
  const newEventIds = new Set(Object.keys(events));
  Object.keys(internalState)
    .filter((key) => !newEventIds.has(key))
    .forEach((key) => {
      internalState[key].status = "REMOVED";
    });
};
