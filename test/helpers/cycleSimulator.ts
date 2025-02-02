import { RawModel } from "../../src/models";
import Match from "./matchSimulator";

const DEFAULT_MAPPINGS = {
  status_pre: "PRE",
  status_live: "LIVE",
  status_removed: "REMOVED",
  period_current: "CURRENT",
  period_1: "PERIOD_1",
  period_2: "PERIOD_2",
  period_3: "PERIOD_3",
  period_4: "PERIOD_4",
};

const FOOTBALL_TEAMS = {
  barcelona: "Barcelona",
  realMadrid: "Real Madrid",
  bayernMunich: "Bayern Munich",
  parisSaintGermain: "Paris Saint-Germain",
  liverpool: "Liverpool",
  acMilan: "AC Milan",
  legiaWarsaw: "Legia Warsaw",
} as const;

const BASKETBALL_TEAMS = {
  laLakers: "Los Angeles Lakers",
  bostonCeltics: "Boston Celtics",
  chicagoBulls: "Chicago Bulls",
  philadelphia76ers: "Philadelphia 76ers",
  miamiHeat: "Miami Heat",
  denverNuggets: "Denver Nuggets",
} as const;

const FOOTBALL_COMPETITIONS = {
  laLiga: "La Liga",
  bundesliga: "Bundesliga",
  ligue1: "Ligue 1",
  premierLeague: "Premier League",
  serieA: "Serie A",
  ekstraklasa: "Ekstraklasa",
  championsLeague: "Champions League",
  europaLeague: "Europa League",
} as const;

const BASKETBALL_COMPETITIONS = {
  nba: "NBA",
  nbaPlayoffs: "NBA Playoffs",
} as const;

const SPORTS = {
  football: {
    name: "FOOTBALL",
    teams: FOOTBALL_TEAMS,
    competitions: FOOTBALL_COMPETITIONS,
  },
  basketball: {
    name: "BASKETBALL",
    teams: BASKETBALL_TEAMS,
    competitions: BASKETBALL_COMPETITIONS,
  },
} as const;

const MATCH_STATUS_MAPPING = {
  PRE: "status_pre",
  IN: "status_live",
  POST: "status_removed",
} as const;

type SportEventWithMatch = {
  event: RawModel.SportEvent;
  match: Match;
};

class CycleSimulator {
  private mappings: RawModel.MappingDict;
  private eventMatchMap: Map<string, SportEventWithMatch>;

  constructor() {
    this.mappings = DEFAULT_MAPPINGS;
    this.eventMatchMap = new Map();
  }

  getMappings() {
    return this.mappings;
  }

  withFootballTeam(teamKey: keyof typeof FOOTBALL_TEAMS) {
    this.mappings = {
      ...this.mappings,
      football: "FOOTBALL",
      [teamKey]: FOOTBALL_TEAMS[teamKey],
    };
    return this;
  }

  withBasketballTeam(teamKey: keyof typeof BASKETBALL_TEAMS) {
    this.mappings = {
      ...this.mappings,
      basketball: "BASKETBALL",
      [teamKey]: BASKETBALL_TEAMS[teamKey],
    };
    return this;
  }

  withEvent<S extends keyof typeof SPORTS>(
    eventId: string,
    startTime: string,
    sportKey: S,
    competitionKey: S extends "football" ? keyof typeof FOOTBALL_COMPETITIONS : keyof typeof BASKETBALL_COMPETITIONS,
    homeKey: S extends "football" ? keyof typeof FOOTBALL_TEAMS : keyof typeof BASKETBALL_TEAMS,
    awayKey: S extends "football" ? keyof typeof FOOTBALL_TEAMS : keyof typeof BASKETBALL_TEAMS
  ) {
    // add competition to mappings
    const sport = SPORTS[sportKey];
    this.mappings = {
      ...this.mappings,
      [competitionKey]: (sport.competitions as any)[competitionKey],
    };

    this.eventMatchMap.set(eventId, {
      event: {
        id: eventId,
        sportId: sportKey,
        status: "status_pre",
        startTime,
        competitionId: competitionKey,
        scores: [],
        homeCompetitorId: homeKey,
        awayCompetitorId: awayKey,
      },
      match: new Match(),
    });

    return this;
  }

  getCurrentState() {
    return Array.from(this.eventMatchMap.values()).map(({ event, match }) => {
      const status = MATCH_STATUS_MAPPING[match.getStatus()];

      const scores: RawModel.PeriodScore[] = [];

      if (match.getStatus() !== "PRE") {
        scores.push({
          periodId: "period_current",
          homeScore: String(match.getCurrentScore().home),
          awayScore: String(match.getCurrentScore().away),
        });
      }

      scores.push(
        ...Object.entries(match.getScores()).map(([period, { home, away }]) => ({
          periodId: `period_${period}`,
          homeScore: String(home),
          awayScore: String(away),
        }))
      );

      return {
        id: event.id,
        sportId: event.sportId,
        competitionId: event.competitionId,
        status,
        homeCompetitorId: event.homeCompetitorId,
        awayCompetitorId: event.awayCompetitorId,
        startTime: event.startTime,
        scores,
      };
    });
  }

  startMatch(eventId: string | string[]) {
    const events = Array.isArray(eventId) ? eventId : [eventId];
    events.forEach((eventId) => {
      const { match } = this.findEvent(eventId);
      match.start();
    });
  }

  startNewPeriod(eventId: string) {
    const { match } = this.findEvent(eventId);
    match.startNewPeriod();
  }

  score(eventId: string, team: "home" | "away", points: number = 1) {
    const { match } = this.findEvent(eventId);
    match.score(team, points);
  }

  endMatch(eventId: string) {
    const { match } = this.findEvent(eventId);
    match.endMatch();
  }

  removeEvent(eventId: string) {
    this.eventMatchMap.delete(eventId);
  }

  findEvent(eventId: string) {
    const event = this.eventMatchMap.get(eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }
    return event;
  }
}

export default CycleSimulator;
