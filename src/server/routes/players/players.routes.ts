import { createRoute, z } from "@hono/zod-openapi";
import * as HTTPStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "@/server/lib/constants";
import { idParamsSchema, playersRequestSchema, teamRequestSchema, teamResponseSchema, teamViewResponseSchema } from "@/server/lib/zod-types";

const tags = ["players"];

export const list = createRoute({
    tags,
    path: "/players",
    method: "get",
    request: {
        query: playersRequestSchema,
    },
    responses: {
        [HTTPStatusCodes.OK]: jsonContent(teamResponseSchema, "The List Of Teams"),
        [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(teamRequestSchema), "The validation error(s)"),
        [HTTPStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(z.object({ message: z.string() }), "Server error(s)"),
    },
});


export const getOne = createRoute({
    tags,
    path: "/players/{id}",
    method: "get",
    request: {
        params: idParamsSchema,
    },
    responses: {
        [HTTPStatusCodes.OK]: jsonContent(teamViewResponseSchema, "Get Specific Team By ID"),
        [HTTPStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(idParamsSchema), "Invalid ID param"),
        [HTTPStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task Not Found"),
        [HTTPStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(z.object({ message: z.string() }), "Server error(s)"),
    },
});

export type ListRoute = typeof list;
export type GetOneRoute = typeof getOne;
