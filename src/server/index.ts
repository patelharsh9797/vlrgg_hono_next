import createApp from "@/server/lib/create-app";

import index from "@/server/routes/index.route";
// import players from "@/server/routes/players/players.index";
import teams from "@/server/routes/teams/teams.index";

import env from "@/env";
import configureOpenAPI from "./lib/configure-open-api";

const hono_app = createApp(env.API_BASE_PATH);

const routes = [index, teams] as const;

configureOpenAPI(hono_app);

routes.map((route) => hono_app.route("/", route));


export default hono_app;

export type HonoAppType = typeof routes[number]
