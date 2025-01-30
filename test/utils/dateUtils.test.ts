import { describe, expect, it } from "vitest";
import { formatDate } from "../../src/utils/dateUtils";

describe("dateUtils", () => {
  it.each([
    { input: 1738195200000, expected: "2025-01-30T00:00:00.000Z" },
    { input: "1738195200000", expected: "2025-01-30T00:00:00.000Z" },
    { input: 1735690200000, expected: "2025-01-01T00:10:00.000Z" },
    { input: "1735690200000", expected: "2025-01-01T00:10:00.000Z" },
    { input: 0, expected: "1970-01-01T00:00:00.000Z" },
    { input: "0", expected: "1970-01-01T00:00:00.000Z" },
  ])("should format timestamp $input to ISO string", ({ input, expected }) => {
    expect(formatDate(input)).toEqual(expected);
  });
});
