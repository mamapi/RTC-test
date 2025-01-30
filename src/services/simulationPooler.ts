import ApiClient from "./apiClient";
import { parseMappings, parseOdds } from "./parser";
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
      const odds = parseOdds(stateResponse.odds);
      updateState(odds, mappings);
    } catch (error) {
      console.error("Error in simulation pooler", error);
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
