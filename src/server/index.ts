import createApp from "@/server/lib/create-app";

import index from "@/server/routes/index.route";
import configureOpenAPI from "./lib/configure-open-api";
import env from "@/env";
// import tasks from "@/routes/tasks/tasks.index";

const hono_server = createApp(env.API_BASE_PATH);

configureOpenAPI(hono_server);

const routes = [index];

routes.forEach((route) => hono_server.route("/", route));

export default hono_server;
