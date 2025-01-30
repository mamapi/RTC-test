import { MappingDictionary, SportEventOdd, SportEventScore } from "../models/rowModel";

export const parseMappings = (rawMappings: string): MappingDictionary => {
  return Object.fromEntries(rawMappings.split(";").map((entry) => entry.split(":")));
};

export const parseOdds = (rawOdds: string): SportEventOdd[] => {
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

const parseScores = (scores?: string): SportEventScore[] => {
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
