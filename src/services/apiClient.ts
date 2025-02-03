import Logger from "./logger";

export interface StateResponse {
  odds: string;
}

export interface MappingsResponse {
  mappings: string;
}

class ApiClient {
  constructor(private baseUrl: string, private timeoutMs: number = 1000) {}

  async fetchState(): Promise<StateResponse> {
    return this.fetchWithTimeout<StateResponse>("/state");
  }

  async fetchMappings(): Promise<MappingsResponse> {
    return this.fetchWithTimeout<MappingsResponse>("/mappings");
  }

  private async fetchWithTimeout<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        signal: AbortSignal.timeout(this.timeoutMs),
      });

      if (!response.ok) {
        throw new Error(`Request to ${endpoint} failed with status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      Logger.error(`Request to ${endpoint} failed with error: ${error.message || error}`);
      throw error;
    }
  }
}

export default ApiClient;
