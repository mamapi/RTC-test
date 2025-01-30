export type EventStatus = "PRE" | "LIVE" | "REMOVED";

export type EventDict = Record<string, SportEvent>;

export type PeriodType = "CURRENT" | `PERIOD_${number}`;

export type PeriodScore = {
  type: PeriodType;
  home: string;
  away: string;
};

export type CompetitorType = "HOME" | "AWAY";

export type SportEvent = {
  id: string;
  status: EventStatus;
  scores: Record<PeriodType, PeriodScore>;
  startTime: string | null;
  sport: string;
  competition: string;
  competitors: Record<CompetitorType, { type: CompetitorType; name: string }>;
};
