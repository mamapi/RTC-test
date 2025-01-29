export type MappingDictionary = Record<string, string>;

export type SportEventOdd = {
  id: string;
  sportId: string;
  competitionId: string;
  startTime: string;
  homeCompetitorId: string;
  awayCompetitorId: string;
  status: string;
  scores: string;
};

export const parseMappings = (rawMappings: string): MappingDictionary => {
  return Object.fromEntries(
    rawMappings.split(";").map((entry) => entry.split(":"))
  );
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
      scores,
    };
  });
  return odds;
};
