type MatchStatus = "PRE" | "IN" | "POST";

class Match {
  private status: MatchStatus;

  constructor() {
    this.status = "PRE";
  }

  start() {
    this.status = "IN";
  }

  getStatus() {
    return this.status;
  }
}

export default Match;
