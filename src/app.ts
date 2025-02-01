import Hapi from "@hapi/hapi";
import Logger from "./services/logger";
import clientRoutes from "./routes/client";
import ApiClient from "./services/apiClient";
import SimulationPooler from "./services/simulationPooler";
import { ServerConfig, getConfig } from "./config";

export type AppContext = {
  server: Hapi.Server;
  pooler: SimulationPooler;
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

  const initPooler = () => {
    const apiClient = new ApiClient(config.simulationApiUrl);
    return new SimulationPooler(apiClient, config.poolerIntervalMs);
  };

  const setupShutdown = (server: Hapi.Server, pooler: SimulationPooler) => {
    const gracefulShutdown = async () => {
      Logger.info("Shutting down server...");
      await server.stop();
      pooler.stop();
      process.exit(0);
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  };

  const server = initServer();
  const pooler = initPooler();
  setupShutdown(server, pooler);

  return { server, pooler };
};

export const start = async (app: AppContext) => {
  const { server, pooler } = app;

  pooler.start();
  await server.start();

  const { host, port } = server.settings;
  Logger.info(`Listening on ${host}:${port}`);
};

export const stop = async (app: AppContext) => {
  const { server, pooler } = app;
  await server.stop();
  pooler.stop();
};
