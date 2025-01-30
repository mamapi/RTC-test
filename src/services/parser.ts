import { MappingDict, SportEvent, PeriodScore } from "../models/rowModel";

export const parseMappings = (rawMappings: string): MappingDict => {
  return Object.fromEntries(rawMappings.split(";").map((entry) => entry.split(":")));
};

export const parseOdds = (rawOdds: string): SportEvent[] => {
  const odds = rawOdds.split("\n").map((odd) => {
    const [id, sportId, competitionId, startTime, homeCompetitorId, awayCompetitorId, status, scores] = odd.split(",");
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
  return odds;
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
