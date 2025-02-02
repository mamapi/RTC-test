import Logger from "./logger";

abstract class AbstractFetcher {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(private readonly intervalMs: number) {}

  start() {
    if (this.intervalId) {
      Logger.warn("Fetcher is already started.");
      return;
    }

    this.intervalId = setInterval(() => this.runSafely(), this.intervalMs);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async runSafely() {
    if (this.isRunning) {
      Logger.warn("Fetcher is already running.");
      return;
    }

    this.isRunning = true;

    try {
      await this.onTick();
    } finally {
      this.isRunning = false;
    }
  }

  protected abstract onTick(): Promise<void>;
}

export default AbstractFetcher;
