import { RawModel, SportEventModel } from "../models";
import { formatDate } from "../utils/dateUtils";

export const mapSportEvents = (events: RawModel.SportEvent[], mappings: RawModel.MappingDict) =>
  Object.fromEntries(events.map((event) => [event.id, mapSportEvent(event, mappings)]));

const mapSportEvent = (event: RawModel.SportEvent, mappings: RawModel.MappingDict): SportEventModel.SportEvent => {
  validateMappings(event, mappings);

  const scores = mapScores(event.scores, mappings);
  const competitors = mapCompetitors(event.homeCompetitorId, event.awayCompetitorId, mappings);
  const startTime = formatDate(event.startTime);
  const sportEvent: SportEventModel.SportEvent = {
    id: event.id,
    status: mappings[event.status] as SportEventModel.EventStatus,
    scores,
    startTime,
    sport: mappings[event.sportId],
    competition: mappings[event.competitionId],
    competitors,
  };

  return sportEvent;
};

const validateMappings = (event: RawModel.SportEvent, mappings: RawModel.MappingDict) => {
  const requiredKeys = [
    event.status,
    event.sportId,
    event.competitionId,
    event.homeCompetitorId,
    event.awayCompetitorId,
    ...event.scores.map((score) => score.periodId),
  ];

  const missingMapping = requiredKeys.find((key) => !mappings[key]);

  if (missingMapping) {
    throw new Error(`Cannot map sport events: Missing mapping for ${missingMapping}`);
  }
};

const mapScores = (scores: RawModel.PeriodScore[], mappings: RawModel.MappingDict) =>
  Object.fromEntries(
    scores.map((score) => {
      const periodType = mappings[score.periodId] as SportEventModel.PeriodType;

      const periodScore: SportEventModel.PeriodScore = {
        type: periodType,
        home: score.homeScore,
        away: score.awayScore,
      };

      return [periodType, periodScore];
    })
  ) as Record<SportEventModel.PeriodType, SportEventModel.PeriodScore>;

export const mapCompetitors = (
  homeCompetitorId: string,
  awayCompetitorId: string,
  mappings: RawModel.MappingDict
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
