type MatchStatus = "PRE" | "IN" | "POST";
type Team = "home" | "away";

class Match {
  private status: MatchStatus;
  private currentScore: { home: number; away: number };
  private scores: Record<number, { home: number; away: number }>;
  private currentPeriod: number;

  constructor() {
    this.status = "PRE";
    this.scores = {};
  }

  start() {
    this.status = "IN";
    this.currentScore = { home: 0, away: 0 };

    this.currentPeriod = 1;
    this.scores[this.currentPeriod] = { home: 0, away: 0 };
  }

  getStatus() {
    return this.status;
  }

  score(team: Team, points: number = 1) {
    this.currentScore[team] += points;
    this.scores[this.currentPeriod][team] += points;
  }

  getCurrentScore() {
    return this.currentScore;
  }

  getScores() {
    return this.scores;
  }

  startNewPeriod() {
    this.currentPeriod++;
    this.scores[this.currentPeriod] = { home: 0, away: 0 };
  }
}

export default Match;
