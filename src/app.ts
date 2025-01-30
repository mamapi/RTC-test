import Hapi from "@hapi/hapi";
import clientRoutes from "./routes/client";
import ApiClient from "./services/apiClient";
import SimulationPooler from "./services/simulationPooler";
import { ServerConfig, getConfig } from "./config";

export let server: Hapi.Server;

export const init = async (config: ServerConfig = getConfig()): Promise<Hapi.Server> => {
  server = Hapi.server({
    port: config.apiPort,
    host: "localhost",
  });

  server.route(clientRoutes);

  const apiClient = new ApiClient(config.simulationApiUrl);
  const pooler = new SimulationPooler(apiClient, config.poolerIntervalMs);
  pooler.start();

  return server;
};

export const start = async () => {
  const { host, port } = server.settings;
  console.log(`Listening on ${host}:${port}`);
  await server.start();
};

init()
  .then(start)
  .catch((err) => console.error("Error while starting server", err));
