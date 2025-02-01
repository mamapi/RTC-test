import Hapi from "@hapi/hapi";
import Logger from "./services/logger";
import clientRoutes from "./routes/client";
import ApiClient from "./services/apiClient";
import ApiFetcher from "./services/apiFetcher";
import { ServerConfig, getConfig } from "./config";

export type AppContext = {
  server: Hapi.Server;
  fetcher: ApiFetcher;
};

export const init = async (config: ServerConfig = getConfig()): Promise<AppContext> => {
  Logger.setLogLevel(config.logLevel);

  const initServer = () => {
    const server = Hapi.server({
      port: config.apiPort,
      host: "localhost",
    });

    server.route(clientRoutes);

    server.events.on("response", (request) => {
      const { method, path } = request;
      Logger.info(`${method.toUpperCase()} ${path}`);
    });

    return server;
  };

  const initFetcher = () => {
    const apiClient = new ApiClient(config.simulationApiUrl);
    return new ApiFetcher(apiClient, config.fetcherIntervalMs);
  };

  const setupShutdown = (server: Hapi.Server, fetcher: ApiFetcher) => {
    const gracefulShutdown = async () => {
      Logger.info("Shutting down server...");
      await server.stop();
      fetcher.stop();
      process.exit(0);
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  };

  const server = initServer();
  const fetcher = initFetcher();
  setupShutdown(server, fetcher);

  return { server, fetcher };
};

export const start = async (app: AppContext) => {
  const { server, fetcher } = app;

  fetcher.start();
  await server.start();

  const { host, port } = server.settings;
  Logger.info(`Listening on ${host}:${port}`);
};

export const stop = async (app: AppContext) => {
  const { server, fetcher } = app;
  await server.stop();
  fetcher.stop();
};
