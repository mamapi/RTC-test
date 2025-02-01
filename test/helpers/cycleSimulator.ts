import { RawModel } from "../../src/models";
import Match from "./matchSimulator";

const DEFAULT_MAPPINGS = {
  status_pre: "PRE",
  status_live: "LIVE",
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
} as const;

class CycleSimulator {
  private mappings: RawModel.MappingDict;
  private events: RawModel.SportEvent[];
  private matches: Map<string, Match>;

  constructor() {
    this.mappings = DEFAULT_MAPPINGS;
    this.events = [];
    this.matches = new Map();
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
    this.events.push({
      id: eventId,
      sportId: sportKey,
      status: "status_pre",
      startTime,
      competitionId: competitionKey,
      scores: [],
      homeCompetitorId: homeKey,
      awayCompetitorId: awayKey,
    });

    this.matches.set(eventId, new Match());

    return this;
  }

  getCurrentState() {
    return this.events.map((event) => {
      const match = this.matches.get(event.id)!;
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

  startMatch(eventId: string) {
    const event = this.events.find((event) => event.id === eventId);
    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }
    this.matches.get(eventId)?.start();
  }

  startNewPeriod(eventId: string) {
    this.matches.get(eventId)!.startNewPeriod();
  }

  score(eventId: string, team: "home" | "away", points: number = 1) {
    this.matches.get(eventId)!.score(team, points);
  }

}

export default CycleSimulator;
