import { describe, expect, it } from "vitest";
import Match from "./matchSimulator";

describe("Match Simulator", () => {
  it("should simulate pre match", () => {
    const match = new Match();
    expect(match.getStatus()).toBe("PRE");
  });

  it("should simulate start match", () => {
    const match = new Match();
    match.start();
    expect(match.getStatus()).toBe("IN");
  });

  it("should simulate match", () => {
    const match = new Match();
    match.start();

    match.score("home");
    expect(match.getStatus()).toBe("IN");
    expect(match.getCurrentScore()).toStrictEqual({ home: 1, away: 0 });
    expect(match.getScores()).toStrictEqual({ 1: { home: 1, away: 0 } });

    match.score("home", 2);
    expect(match.getCurrentScore()).toStrictEqual({ home: 3, away: 0 });
    expect(match.getScores()).toStrictEqual({ 1: { home: 3, away: 0 } });

    match.score("away", 2);
    expect(match.getCurrentScore()).toStrictEqual({ home: 3, away: 2 });
    expect(match.getScores()).toStrictEqual({ 1: { home: 3, away: 2 } });

    match.startNewPeriod();
    expect(match.getCurrentScore()).toStrictEqual({ home: 3, away: 2 });
    expect(match.getScores()).toStrictEqual({
      1: { home: 3, away: 2 },
      2: { home: 0, away: 0 },
    });

    match.score("home");
    expect(match.getCurrentScore()).toStrictEqual({ home: 4, away: 2 });
    expect(match.getScores()).toStrictEqual({
      1: { home: 3, away: 2 },
      2: { home: 1, away: 0 },
    });

    match.endMatch();
    expect(match.getStatus()).toBe("POST");
    expect(match.getCurrentScore()).toStrictEqual({ home: 4, away: 2 });
    expect(match.getScores()).toStrictEqual({
      1: { home: 3, away: 2 },
      2: { home: 1, away: 0 },
    });
  });
});
