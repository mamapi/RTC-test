import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Logger, { LoggerColors, LogLevels } from "../../src/services/logger";

const fakeDate = new Date("2025-01-29T12:00:00.000Z");

describe("Logger", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.useFakeTimers();
    vi.setSystemTime(fakeDate);
    Logger.setLogLevel("info");
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

  it.each(testCases)("should log %s message when log level is debug", (level, message, color) => {
    Logger.setLogLevel("debug");
    Logger[level](message);
    const reset = LoggerColors.reset;
    expect(console.log).toHaveBeenCalledWith(
      `[${fakeDate.toISOString()}] ${color}[${level.toUpperCase()}]${reset} ${message}`
    );
  });

  it("should log when message level is equal or higher than current level", () => {
    Logger.setLogLevel("warn");
    Logger.warn("Warning message");
    Logger.error("Error message");
    Logger.info("Info message"); // should not be logged
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});
