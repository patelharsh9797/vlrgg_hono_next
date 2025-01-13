import createApp from "@/server/lib/create-app";

import index from "@/server/routes/index.route";
import teams from "@/server/routes/teams/teams.index";

import env from "@/env";
import configureOpenAPI from "./lib/configure-open-api";

const hono_server = createApp(env.API_BASE_PATH);

configureOpenAPI(hono_server);

const routes = [index, teams];

routes.forEach((route) => hono_server.route("/", route));

export default hono_server;
