class ApiClient {
  constructor(private baseUrl: string) {}

  async fetchState() {
    const response = await fetch(`${this.baseUrl}/state`);
    return response.json();
  }
}

export default ApiClient;
