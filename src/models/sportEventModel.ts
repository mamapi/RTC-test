export type SportEventStatus = "PRE" | "LIVE" | "REMOVED";

export type SportEvents = Record<string, SportEvent>;

export type PeriodId = "CURRENT" | `PERIOD_${number}`;

export type PeriodScore = {
  type: PeriodId;
  home: string;
  away: string;
};

export type CompetitorType = "HOME" | "AWAY";

export type SportEvent = {
  id: string;
  status: SportEventStatus;
  scores: Record<PeriodId, PeriodScore>;
  startTime: string | null;
  sport: string;
  competition: string;
  competitors: Record<CompetitorType, { type: CompetitorType; name: string }>;
};
