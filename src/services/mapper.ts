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
  const sportEvents: SportEvents = {};
  for (const odd of odds) {
    sportEvents[odd.id] = mapSportEvent(odd, mappings);
  }
  return sportEvents;
};

const mapSportEvent = (odd: SportEventOdd, mappings: MappingDictionary): SportEvent => {
  const scores = odd.scores.reduce((acc, score) => {
    acc[score.periodId] = {
      type: score.periodId,
      home: score.homeScore,
      away: score.awayScore,
    };
    return acc;
  }, {} as Record<PeriodId, { type: PeriodId; home: string; away: string }>);

  const competitors = {
    HOME: {
      type: "HOME" as const,
      name: mappings[odd.homeCompetitorId],
    },
    AWAY: {
      type: "AWAY" as const,
      name: mappings[odd.awayCompetitorId],
    },
  };

  const sportEvent: SportEvent = {
    id: odd.id,
    status: mappings[odd.status] as SportEventStatus,
    scores,
    startTime: odd.startTime,
    sport: mappings[odd.sportId],
    competition: mappings[odd.competitionId],
    competitors,
  };

  return sportEvent;
};
