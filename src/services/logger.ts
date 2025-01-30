export const LoggerColors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
};

export type LogLevels = "info" | "debug" | "warn" | "error";

class Logger {
  static info(message: string) {
    this.log(message, "info", "green");
  }

  static debug(message: string) {
    this.log(message, "debug", "blue");
  }

  static warn(message: string) {
    this.log(message, "warn", "yellow");
  }

  static error(message: string) {
    this.log(message, "error", "red");
  }

  private static log(message: string, level: LogLevels, colorKey: keyof typeof LoggerColors) {
    const timestamp = this.getTimestamp();
    const color = LoggerColors[colorKey];
    const reset = LoggerColors.reset;
    console.log(`[${timestamp}] ${color}[${level.toUpperCase()}]${reset} ${message}`);
  }

  private static getTimestamp(): string {
    return new Date().toISOString();
  }
}

export default Logger;
