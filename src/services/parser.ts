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
  return [];
};
