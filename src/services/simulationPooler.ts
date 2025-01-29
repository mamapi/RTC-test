class SimulationPooler {
  private intervalId: NodeJS.Timeout | null = null;

  constructor(private readonly intervalMs: number) {}

  start() {
    this.intervalId = setInterval(() => {
      this.onTick();
    }, this.intervalMs);
  }

  private onTick() {
    console.log("tick");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default SimulationPooler;
