import { describe, expect, it } from "vitest";
import { RawModel } from "../../src/models";
import { parseMappings, parseEvents } from "../../src/services/parser";

describe("Parser", () => {
  describe("parseMappings()", () => {
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

    describe("validation", () => {
      it.each([
        { scenario: "empty", input: "" },
        { scenario: "null", input: null },
        { scenario: "undefined", input: undefined },
        { scenario: "whitespace only", input: " " },
      ])("should throw error when mappings input is $scenario", ({ input }) => {
        expect(() => parseMappings(input)).toThrow("Cannot parse mappings: Invalid mappings input");
      });
    });
  });

  describe("parseEvents()", () => {
    it("should parse the events correctly", () => {
      const event1 =
        "sportEventId1,sportId1,cometitionId1,1709900432183,homeTeamId1,awayTeamId1,statusId1,periodId1@1:1|periodId2@1:2";

      const event2 =
        "sportEventId2,sportId2,cometitionId2,1709900432180,homeTeamId2,awayTeamId2,statusId2,periodId2@0:0";

      const events = `${event1}\n${event2}`;

      const expectedEvents: RawModel.SportEvent[] = [
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
      const parsedEvents = parseEvents(events);
      expect(parsedEvents).toEqual(expectedEvents);
    });

    describe("validation", () => {
      it("should not fail if there are no scores", () => {
        const event = "sportEventId1,sportId1,cometitionId1,1709900432183,homeTeamId1,awayTeamId1,statusId1";
        const expectedEvents: RawModel.SportEvent[] = [
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
        const parsedEvents = parseEvents(event);
        expect(parsedEvents).toEqual(expectedEvents);
      });

      it.each([
        "sportEventId1,sportId1,,",
        "sportEventId1,sportId1,competitionId1,1709900432183,homeTeamId1,awayTeamId1,statusId1,,,,,",
      ])("should throw error when event has insufficient fields", (input) => {
        expect(() => parseEvents(input)).toThrow(
          `Cannot parse events: Invalid number of fields at line 1. Expected 7 or 8, got ${input.split(",").length}`
        );
      });

      it.each([
        { scenario: "empty", input: "" },
        { scenario: "null", input: null },
        { scenario: "undefined", input: undefined },
        { scenario: "whitespace only", input: " " },
      ])("should return empty array when events input is $scenario", ({ input }) => {
        expect(parseEvents(input)).toEqual([]);
      });
    });
  });
});
