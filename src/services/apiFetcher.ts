import ApiClient from "./apiClient";
import Logger from "./logger";
import { parseMappings, parseEvents } from "./parser";
import { updateState } from "./stateManager";

class ApiFetcher {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(private readonly apiClient: ApiClient, private readonly intervalMs: number) {}

  start() {
    this.intervalId = setInterval(async () => {
      if (this.isRunning) {
        Logger.warn("API fetcher is already running");
        return;
      }

      this.isRunning = true;
      try {
        await this.onTick();
      } finally {
        this.isRunning = false;
      }
    }, this.intervalMs);
  }

  private async onTick() {
    try {
      const [stateResponse, mappingsResponse] = await Promise.all([
        this.apiClient.fetchState(),
        this.apiClient.fetchMappings(),
      ]);
      const mappings = parseMappings(mappingsResponse.mappings);
      const events = parseEvents(stateResponse.odds);
      updateState(events, mappings);
      Logger.debug(`Updated state with ${Object.keys(events).length} events`);
    } catch (error) {
      Logger.error(`Error in API fetcher: ${error}`);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default ApiFetcher;
