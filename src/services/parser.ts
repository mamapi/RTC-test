import { MappingDict, SportEvent, PeriodScore } from "../models/rowModel";

export const parseMappings = (rawMappings: string): MappingDict => {
  return Object.fromEntries(rawMappings.split(";").map((entry) => entry.split(":")));
};

export const parseEvents = (rawEvents: string): SportEvent[] => {
  const events = rawEvents.split("\n").map((event) => {
    const [id, sportId, competitionId, startTime, homeCompetitorId, awayCompetitorId, status, scores] = event.split(",");
    return {
      id,
      sportId,
      competitionId,
      startTime,
      homeCompetitorId,
      awayCompetitorId,
      status,
      scores: parseScores(scores),
    };
  });
  return events;
};

const parseScores = (scores?: string): PeriodScore[] => {
  if (!scores) return [];

  return scores.split("|").map((score) => {
    const [periodId, periodScores] = score.split("@");
    const [homeScore, awayScore] = periodScores.split(":");
    return {
      periodId,
      homeScore,
      awayScore,
    };
  });
};
