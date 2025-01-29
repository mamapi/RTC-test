export interface StateResponse {
  odds: string;
}

export interface MappingsResponse {
  mappings: string;
}

class ApiClient {
  constructor(private baseUrl: string) {}

  async fetchState(): Promise<StateResponse> {
    const response = await fetch(`${this.baseUrl}/state`);
    return response.json();
  }

  async fetchMappings(): Promise<MappingsResponse> {
    const response = await fetch(`${this.baseUrl}/mappings`);
    return response.json();
  }
}

export default ApiClient;
