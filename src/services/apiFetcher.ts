import AbstractFetcher from "./abstractFetcher";
import ApiClient from "./apiClient";
import Logger from "./logger";
import { parseMappings, parseEvents } from "./parser";
import { updateState } from "./stateManager";

class ApiFetcher extends AbstractFetcher {
  constructor(private readonly apiClient: ApiClient, intervalMs: number) {
    super(intervalMs);
  }

  protected async onTick() {
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
}

export default ApiFetcher;
