import { RawModel, SportEventModel } from "../models";
import { formatDate } from "../utils/dateUtils";

export const mapSportEvents = (odds: RawModel.SportEventOdd[], mappings: RawModel.MappingDictionary) =>
  Object.fromEntries(odds.map((odd) => [odd.id, mapSportEvent(odd, mappings)]));

const mapSportEvent = (odd: RawModel.SportEventOdd, mappings: RawModel.MappingDictionary): SportEventModel.SportEvent => {
  const scores = mapScores(odd.scores, mappings);
  const competitors = mapCompetitors(odd.homeCompetitorId, odd.awayCompetitorId, mappings);
  const startTime = formatDate(odd.startTime);
  const sportEvent: SportEventModel.SportEvent = {
    id: odd.id,
    status: mappings[odd.status] as SportEventModel.SportEventStatus,
    scores,
    startTime,
    sport: mappings[odd.sportId],
    competition: mappings[odd.competitionId],
    competitors,
  };

  return sportEvent;
};

const mapScores = (scores: RawModel.SportEventScore[], mappings: RawModel.MappingDictionary) =>
  Object.fromEntries(
    scores.map((score) => {
      const periodType = mappings[score.periodId] as SportEventModel.PeriodId;

      const periodScore: SportEventModel.PeriodScore = {
        type: periodType,
        home: score.homeScore,
        away: score.awayScore,
      };

      return [periodType, periodScore];
    })
  ) as Record<SportEventModel.PeriodId, SportEventModel.PeriodScore>;

export const mapCompetitors = (
  homeCompetitorId: string,
  awayCompetitorId: string,
  mappings: RawModel.MappingDictionary
): Record<SportEventModel.CompetitorType, { type: SportEventModel.CompetitorType; name: string }> => {
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
