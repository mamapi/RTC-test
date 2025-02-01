type MatchStatus = "PRE" | "IN" | "POST";
type Team = "home" | "away";

class Match {
  private status: MatchStatus;
  private currentScore: { home: number; away: number };

  constructor() {
    this.status = "PRE";
  }

  start() {
    this.status = "IN";
    this.currentScore = { home: 0, away: 0 };
  }

  getStatus() {
    return this.status;
  }

  score(team: Team, points: number = 1) {
    this.currentScore[team] += points;
  }

  getCurrentScore() {
    return this.currentScore;
  }
}

export default Match;
