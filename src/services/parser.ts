import { MappingDict, SportEvent, PeriodScore } from "../models/rowModel";

export const parseMappings = (rawMappings?: string | null): MappingDict => {
  if (!rawMappings?.trim()) throw new Error("Cannot parse mappings: Invalid mappings input");

  return Object.fromEntries(rawMappings.split(";").map((entry) => entry.split(":")));
};

export const parseEvents = (rawEvents?: string | null): SportEvent[] => {
  if (!rawEvents?.trim()) throw new Error("Cannot parse events: Invalid events input");

  const events = rawEvents.split("\n").map((event, index) => {
    const fields = event.split(",");

    if (fields.length < 7) throw new Error(`Cannot parse events: Insufficient number of fields at line ${index + 1}`);

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
