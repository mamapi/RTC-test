import Logger from "./logger";

abstract class AbstractFetcher {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(private readonly intervalMs: number) {}

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

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  protected abstract onTick(): Promise<void>;
}

export default AbstractFetcher;
