import { AppContext, init, start } from "./app";

export let appInstance: AppContext;

init()
  .then(start)
  .catch((err) => console.error("Error while starting server", err));
