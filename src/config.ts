import { LogLevels } from "./services/logger";

export interface ServerConfig {
  apiPort: number;
  simulationApiUrl: string;
  fetcherIntervalMs: number;
  logLevel: LogLevels;
}

export function getConfig(): ServerConfig {
  return {
    apiPort: Number(process.env.API_PORT) || 4000,
    simulationApiUrl: process.env.SIMULATION_API_URL || "http://localhost:3000/api",
    fetcherIntervalMs: Number(process.env.FETCHER_INTERVAL_MS) || 1000,
    logLevel: (process.env.LOG_LEVEL as LogLevels) || "info",
  };
}
