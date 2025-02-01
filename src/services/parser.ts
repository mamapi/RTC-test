import { MappingDict, SportEvent, PeriodScore } from "../models/rowModel";

const delimiters = {
  mapping: {
    entries: ";",
    keyValue: ":",
  },
  event: {
    separator: "\n",
    fields: ",",
  },
  score: {
    periods: "|",
    periodData: "@",
    teams: ":",
  },
} as const;

export const parseMappings = (rawMappings?: string | null): MappingDict => {
  if (!rawMappings?.trim()) {
    throw new Error("Cannot parse mappings: Invalid mappings input");
  }

  return Object.fromEntries(
    rawMappings.split(delimiters.mapping.entries).map((entry) => entry.split(delimiters.mapping.keyValue))
  );
};

export const parseEvents = (rawEvents?: string | null): SportEvent[] => {
  if (!rawEvents?.trim()) {
    throw new Error("Cannot parse events: Invalid events input");
  }

  return rawEvents.split(delimiters.event.separator).map((rawEvent, index) => parseEvent(rawEvent, index));
};

const parseEvent = (rawEvent: string, index: number): SportEvent => {
  const fields = rawEvent.split(delimiters.event.fields);

  if (![7, 8].includes(fields.length)) {
    throw new Error(`Cannot parse events: Insufficient number of fields at line ${index + 1}`);
  }

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
};

const parseScores = (scores?: string): PeriodScore[] => {
  if (!scores) return [];

  return scores.split(delimiters.score.periods).map((score) => {
    const [periodId, periodScores] = score.split(delimiters.score.periodData);
    const [homeScore, awayScore] = periodScores.split(delimiters.score.teams);
    return {
      periodId,
      homeScore,
      awayScore,
    };
  });
};
