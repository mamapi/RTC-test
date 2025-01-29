import { describe, expect, it } from "vitest";
import { parseMappings } from "../../src/services/parser";

describe("Parser", () => {
  it("should parse the mappings correctly", () => {
    const rawMappings = "id1:Real Madrid;id2:Barcelona;id3:Atletico Madrid;id4:Liverpool";
    const expectedMappings = {
      id1: "Real Madrid",
      id2: "Barcelona",
      id3: "Atletico Madrid",
      id4: "Liverpool",
    };
    const parsedMappings = parseMappings(rawMappings);
    expect(parsedMappings).toEqual(expectedMappings);
  });
});
