export type MappingDict = Record<string, string>;

export type SportEvent = {
  id: string;
  sportId: string;
  competitionId: string;
  startTime: string;
  homeCompetitorId: string;
  awayCompetitorId: string;
  status: string;
  scores: PeriodScore[];
};

export type PeriodScore = {
  periodId: string;
  homeScore: string;
  awayScore: string;
};
