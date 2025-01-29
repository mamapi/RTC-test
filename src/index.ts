import Hapi from "@hapi/hapi";
import clientRoutes from "./routes/client";

export let server: Hapi.Server;

export const init = async (): Promise<Hapi.Server> => {
  server = Hapi.server({
    port: Number(process.env.PORT) || 4000,
    host: "localhost",
  });

  server.route(clientRoutes);

  return server;
};

export const start = async () => {
  console.log(`Listening on ${server.settings.host}:${server.settings.port}`);
  await server.start();
};

init()
  .then(start)
  .catch((err) => console.error("Error while starting server", err));
