import { describe, expect, it } from "vitest";
import { RawModel } from "../../src/models";
import { parseMappings, parseOdds } from "../../src/services/parser";

describe("Parser", () => {
  it("should parse the mappings correctly", () => {
    const rawMappings = "id1:Real Madrid;id2:Barcelona;id3:Atletico Madrid;id4:Liverpool";
    const expectedMappings: RawModel.MappingDict = {
      id1: "Real Madrid",
      id2: "Barcelona",
      id3: "Atletico Madrid",
      id4: "Liverpool",
    };
    const parsedMappings = parseMappings(rawMappings);
    expect(parsedMappings).toEqual(expectedMappings);
  });

  it("should parse the odds correctly", () => {
    const odd1 =
      "sportEventId1,sportId1,cometitionId1,1709900432183,homeTeamId1,awayTeamId1,statusId1,periodId1@1:1|periodId2@1:2";

    const odd2 = "sportEventId2,sportId2,cometitionId2,1709900432180,homeTeamId2,awayTeamId2,statusId2,periodId2@0:0";

    const odds = `${odd1}\n${odd2}`;

    const expectedOdds: RawModel.SportEvent[] = [
      {
        id: "sportEventId1",
        sportId: "sportId1",
        competitionId: "cometitionId1",
        startTime: "1709900432183",
        homeCompetitorId: "homeTeamId1",
        awayCompetitorId: "awayTeamId1",
        status: "statusId1",
        scores: [
          {
            periodId: "periodId1",
            homeScore: "1",
            awayScore: "1",
          },
          {
            periodId: "periodId2",
            homeScore: "1",
            awayScore: "2",
          },
        ],
      },
      {
        id: "sportEventId2",
        sportId: "sportId2",
        competitionId: "cometitionId2",
        startTime: "1709900432180",
        homeCompetitorId: "homeTeamId2",
        awayCompetitorId: "awayTeamId2",
        status: "statusId2",
        scores: [
          {
            periodId: "periodId2",
            homeScore: "0",
            awayScore: "0",
          },
        ],
      },
    ];
    const parsedOdds = parseOdds(odds);
    expect(parsedOdds).toEqual(expectedOdds);
  });

  it("should not fail if there are no scores", () => {
    const odd = "sportEventId1,sportId1,cometitionId1,1709900432183,homeTeamId1,awayTeamId1,statusId1";
    const expectedOdds: RawModel.SportEvent[] = [
      {
        id: "sportEventId1",
        sportId: "sportId1",
        competitionId: "cometitionId1",
        startTime: "1709900432183",
        homeCompetitorId: "homeTeamId1",
        awayCompetitorId: "awayTeamId1",
        status: "statusId1",
        scores: [],
      },
    ];
    const parsedOdds = parseOdds(odd);
    expect(parsedOdds).toEqual(expectedOdds);
  });
});
