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
});
