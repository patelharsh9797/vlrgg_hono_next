import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

// import { pinoLogger } from "@/server/middlewares/pino-logger";

import type { AppBindings } from "./types";

export function createRouter() {
    return new OpenAPIHono<AppBindings>({
        strict: false,
        defaultHook,
    });
}

export default function createApp(basePath: string = "/api") {
    const app = createRouter().basePath(basePath);

    app.use(serveEmojiFavicon("📝"));
    // app.use(pinoLogger());

    app.notFound(notFound);
    app.onError(onError);

    return app;
}