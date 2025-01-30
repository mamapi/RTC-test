import Hapi from "@hapi/hapi";
import Logger from "./services/logger";
import clientRoutes from "./routes/client";
import ApiClient from "./services/apiClient";
import SimulationPooler from "./services/simulationPooler";
import { ServerConfig, getConfig } from "./config";

export let server: Hapi.Server;

export const init = async (config: ServerConfig = getConfig()): Promise<Hapi.Server> => {
  Logger.setLogLevel(config.logLevel);

  server = Hapi.server({
    port: config.apiPort,
    host: "localhost",
  });

  server.events.on("response", (request) => {
    const { method, path } = request;
    Logger.info(`${method.toUpperCase()} ${path}`);
  });

  server.route(clientRoutes);

  const apiClient = new ApiClient(config.simulationApiUrl);
  const pooler = new SimulationPooler(apiClient, config.poolerIntervalMs);
  pooler.start();

  return server;
};

export const start = async () => {
  const { host, port } = server.settings;
  Logger.info(`Listening on ${host}:${port}`);
  await server.start();
};

init()
  .then(start)
  .catch((err) => console.error("Error while starting server", err));
