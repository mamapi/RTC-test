import { MappingDictionary, SportEventOdd, SportEventScore } from "./parser";

export type SportEventStatus = "PRE" | "LIVE" | "REMOVED";

export type SportEvents = Record<string, SportEvent>;

export type PeriodId = "CURRENT" | `PERIOD_${number}`;

export type CompetitorType = "HOME" | "AWAY";

export type SportEvent = {
  id: string;
  status: SportEventStatus;
  scores: Record<PeriodId, { type: PeriodId; home: string; away: string }>;
  startTime: string;
  sport: string;
  competition: string;
  competitors: Record<CompetitorType, { type: CompetitorType; name: string }>;
};

export const mapSportEvents = (odds: SportEventOdd[], mappings: MappingDictionary): SportEvents => {
  const sportEvents: SportEvents = {};
  for (const odd of odds) {
    sportEvents[odd.id] = mapSportEvent(odd, mappings);
  }
  return sportEvents;
};

const mapSportEvent = (odd: SportEventOdd, mappings: MappingDictionary): SportEvent => {
  const scores = mapScores(odd.scores);
  const competitors = mapCompetitors(odd.homeCompetitorId, odd.awayCompetitorId, mappings);
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

const mapScores = (scores: SportEventScore[]): Record<PeriodId, { type: PeriodId; home: string; away: string }> => {
  return scores.reduce((acc, score) => {
    acc[score.periodId] = { type: score.periodId, home: score.homeScore, away: score.awayScore };
    return acc;
  }, {} as Record<PeriodId, { type: PeriodId; home: string; away: string }>);
};

const mapCompetitors = (
  homeCompetitorId: string,
  awayCompetitorId: string,
  mappings: MappingDictionary
): Record<CompetitorType, { type: CompetitorType; name: string }> => {
  const competitors = {
    HOME: {
      type: "HOME" as const,
      name: mappings[homeCompetitorId],
    },
    AWAY: {
      type: "AWAY" as const,
      name: mappings[awayCompetitorId],
    },
  };
  return competitors;
};
