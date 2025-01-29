import { MappingDictionary, SportEventOdd } from "./parser";

export type SportEventStatus = "PRE" | "LIVE" | "REMOVED";

export type SportEvents = Record<string, SportEvent>;

export type PeriodId = "CURRENT" | `PERIOD_${number}`;

export type SportEvent = {
  id: string;
  status: SportEventStatus;
  scores: Record<PeriodId, { type: PeriodId; home: string; away: string }>;
  startTime: string;
  sport: string;
  competition: string;
  competitors: {
    HOME: {
      type: "HOME";
      name: string;
    };
    AWAY: {
      type: "AWAY";
      name: string;
    };
  };
};

export const mapSportEvents = (odds: SportEventOdd[], mappings: MappingDictionary): SportEvents => {
  return {};
};
