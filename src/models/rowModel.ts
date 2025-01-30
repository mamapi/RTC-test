export type MappingDictionary = Record<string, string>;

export type SportEventOdd = {
  id: string;
  sportId: string;
  competitionId: string;
  startTime: string;
  homeCompetitorId: string;
  awayCompetitorId: string;
  status: string;
  scores: SportEventScore[];
};

export type SportEventScore = {
  periodId: string;
  homeScore: string;
  awayScore: string;
};
