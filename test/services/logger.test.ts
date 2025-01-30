import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Logger, { LoggerColors } from "../../src/services/logger";

const fakeDate = new Date("2025-01-29T12:00:00.000Z");

describe("Logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.useFakeTimers();
    vi.setSystemTime(fakeDate);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const testCases = [
    ["info", "Test info message", LoggerColors.green],
    ["debug", "Test debug message", LoggerColors.blue],
    ["warn", "Test warn message", LoggerColors.yellow],
    ["error", "Test error message", LoggerColors.red],
  ] as const;

  it.each(testCases)("should log %s message", (level, message, color) => {
    Logger[level](message);
    const reset = LoggerColors.reset;
    expect(console.log).toHaveBeenCalledWith(
      `[${fakeDate.toISOString()}] ${color}[${level.toUpperCase()}]${reset} ${message}`
    );
  });
});
