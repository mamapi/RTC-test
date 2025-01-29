import { ServerRoute } from "@hapi/hapi";
import { getActiveEvents } from "../services/stateManager";

const clientRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/client/state",
    handler: (_request, h) => {
      return h.response(getActiveEvents()).code(200);
    },
  },
];

export default clientRoutes;
