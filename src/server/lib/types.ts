import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";
import type { Schema } from "hono";

export interface AppBindings {
    Variables: {
        logger: PinoLogger;
    };
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;


export type TeamType = {
    id: string;
    url: string;
    name: string;
    img: string;
    country: string;
}
