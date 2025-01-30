import ApiClient from "./apiClient";
import Logger from "./logger";
import { parseMappings, parseEvents } from "./parser";
import { updateState } from "./stateManager";

class SimulationPooler {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private readonly apiClient: ApiClient, private readonly intervalMs: number) {}

  start() {
    this.intervalId = setInterval(() => this.onTick(), this.intervalMs);
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
      Logger.error(`Error in simulation pooler: ${error}`);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default SimulationPooler;
