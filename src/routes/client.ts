import { ServerRoute } from "@hapi/hapi";
import * as clientController from "../controllers/clientController";

const clientRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/client/state",
    handler: clientController.getState,
  },
];

export default clientRoutes;
