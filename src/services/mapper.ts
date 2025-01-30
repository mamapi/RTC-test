import { MappingDictionary, SportEventOdd, SportEventScore } from "./parser";
import { formatDate } from "../utils/dateUtils";

export type SportEventStatus = "PRE" | "LIVE" | "REMOVED";

export type SportEvents = Record<string, SportEvent>;

export type PeriodId = "CURRENT" | `PERIOD_${number}`;

export type PeriodScore = {
  type: PeriodId;
  home: string;
  away: string;
};

export type CompetitorType = "HOME" | "AWAY";

export type SportEvent = {
  id: string;
  status: SportEventStatus;
  scores: Record<PeriodId, PeriodScore>;
  startTime: string;
  sport: string;
  competition: string;
  competitors: Record<CompetitorType, { type: CompetitorType; name: string }>;
};

export const mapSportEvents = (odds: SportEventOdd[], mappings: MappingDictionary) =>
  Object.fromEntries(odds.map((odd) => [odd.id, mapSportEvent(odd, mappings)]));

const mapSportEvent = (odd: SportEventOdd, mappings: MappingDictionary): SportEvent => {
  const scores = mapScores(odd.scores, mappings);
  const competitors = mapCompetitors(odd.homeCompetitorId, odd.awayCompetitorId, mappings);
  const startTime = formatDate(odd.startTime);
  const sportEvent: SportEvent = {
    id: odd.id,
    status: mappings[odd.status] as SportEventStatus,
    scores,
    startTime,
    sport: mappings[odd.sportId],
    competition: mappings[odd.competitionId],
    competitors,
  };

  return sportEvent;
};

const mapScores = (scores: SportEventScore[], mappings: MappingDictionary) =>
  Object.fromEntries(
    scores.map((score) => {
      const periodType = mappings[score.periodId] as PeriodId;

      const periodScore: PeriodScore = {
        type: periodType,
        home: score.homeScore,
        away: score.awayScore,
      };

      return [periodType, periodScore];
    })
  ) as Record<PeriodId, PeriodScore>;

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
