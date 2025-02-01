import { RawModel, SportEventModel } from "../../src/models";
import { PeriodType } from "../../src/models/sportEventModel";

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

class CycleSimulator {
  private mappings: RawModel.MappingDict;

  constructor() {
    this.mappings = DEFAULT_MAPPINGS;
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
}

export default CycleSimulator;
