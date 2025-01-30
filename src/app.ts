import Hapi from "@hapi/hapi";
import clientRoutes from "./routes/client";
import ApiClient from "./services/apiClient";
import SimulationPooler from "./services/simulationPooler";

export let server: Hapi.Server;

const SIMULATION_API_URL = `http://localhost:3000/api`;

export const init = async (): Promise<Hapi.Server> => {
  server = Hapi.server({
    port: Number(process.env.PORT) || 4000,
    host: "localhost",
  });

  server.route(clientRoutes);

  const apiClient = new ApiClient(SIMULATION_API_URL);
  const pooler = new SimulationPooler(apiClient, Number(process.env.POOLER_INTERVAL_MS) || 1000);
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
