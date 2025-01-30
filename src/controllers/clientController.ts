import { ResponseToolkit, Request } from "@hapi/hapi";
import { getActiveEvents } from "../services/stateManager";

export function getState(_request: Request, h: ResponseToolkit) {
  try {
    return h.response(getActiveEvents()).code(200);
  } catch (error) {
    console.error("Error while fetching active events:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
}
