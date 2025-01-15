import { createRouter } from "@/server/lib/create-app";

import * as handlers from "./players.handlers";
import * as routes from "./players.routes";

const router = createRouter()
    .openapi(routes.list, handlers.list)
// .openapi(routes.getOne, handlers.getOne)

export default router;