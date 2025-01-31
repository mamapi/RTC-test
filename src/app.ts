import Hapi from "@hapi/hapi";
import Logger from "./services/logger";
import clientRoutes from "./routes/client";
import ApiClient from "./services/apiClient";
import SimulationPooler from "./services/simulationPooler";
import { ServerConfig, getConfig } from "./config";

export let server: Hapi.Server;
export let pooler: SimulationPooler;

export const init = async (config: ServerConfig = getConfig()): Promise<Hapi.Server> => {
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

  server = initServer();
  pooler = initPooler();

  return server;
};

export const start = async () => {
  pooler.start();
  await server.start();

  const { host, port } = server.settings;
  Logger.info(`Listening on ${host}:${port}`);
};

init()
  .then(start)
  .catch((err) => console.error("Error while starting server", err));
