import { RawModel } from "../models";
import { mapSportEvents, SportEvent } from "./mapper";

let internalState: Record<string, SportEvent> = {};
let currentMappingsHash: string = "";

export const updateState = (odds: RawModel.SportEventOdd[], mappings: RawModel.MappingDictionary) => {
  const [mappingsChanged, newMappingsHash] = hashMappingsChanged(mappings);
  if (mappingsChanged) {
    clearState();
    currentMappingsHash = newMappingsHash;
  }

  const sportEvents = mapSportEvents(odds, mappings);
  updateEvents(sportEvents);
  markRemovedEvents(sportEvents);
};

export const clearState = () => {
  internalState = {};
};

export const geAllEvents = () => internalState;

export const getActiveEvents = () =>
  Object.fromEntries(Object.entries(internalState).filter(([_, event]) => event.status !== "REMOVED"));

const hashMappingsChanged = (mappings: RawModel.MappingDictionary): [boolean, string] => {
  const newHash = JSON.stringify(mappings);
  return [newHash !== currentMappingsHash, newHash];
};

const updateEvents = (events: Record<string, SportEvent>) => {
  Object.assign(internalState, events);
};

const markRemovedEvents = (events: Record<string, SportEvent>) => {
  const newEventIds = new Set(Object.keys(events));
  Object.keys(internalState)
    .filter((key) => !newEventIds.has(key))
    .forEach((key) => {
      internalState[key].status = "REMOVED";
    });
};
