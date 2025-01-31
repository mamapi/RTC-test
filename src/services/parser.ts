import { MappingDict, SportEvent, PeriodScore } from "../models/rowModel";

export const parseMappings = (rawMappings?: string | null): MappingDict => {
  if (!rawMappings?.trim()) throw new Error("Cannot parse mappings: Invalid mappings input");

  return Object.fromEntries(rawMappings.split(";").map((entry) => entry.split(":")));
};

export const parseEvents = (rawEvents: string): SportEvent[] => {
  const events = rawEvents.split("\n").map((event) => {
    const fields = event.split(",");

    if (fields.length < 7) throw new Error("Cannot parse events: Insufficient number of fields");

    const [id, sportId, competitionId, startTime, homeCompetitorId, awayCompetitorId, status, scores] = fields;
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
