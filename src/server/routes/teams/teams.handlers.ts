
import type { AppRouteHandler } from "@/server/lib/types";
import { regionAliases } from "@/server/lib/zod-types";

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { ListRoute, } from "./teams.routes";
import { getTeams } from "./teams.service";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const req_body = c.req.valid("json")

  const pagination = {
    page: req_body.page || 1,
    limit: req_body.limit || 10,
  };

  const regionQuery = req_body.region || "all";
  const region = regionAliases[regionQuery] || regionQuery;

  try {
    const {
      teams,
      pagination: { totalElements, totalPages, hasNextPage },
    } = await getTeams(pagination, region);

    return c.json({
      region: regionQuery,
      size: teams.length,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalElements: totalElements,
        totalPages: totalPages,
        hasNextPage: hasNextPage,
      },
      data: teams
    }, HttpStatusCodes.OK)

  } catch (error) {
    return c.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR }, HttpStatusCodes.INTERNAL_SERVER_ERROR);
  }

};

// export const create: AppRouteHandler<CreateRoute> = async (c) => {
//     const task = c.req.valid("json");

//     const [inserted] = await db.insert(tasks).values(task).returning();

//     return c.json(inserted, HttpStatusCodes.OK);
// };

// export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
//     // const id = c.req.param("id");
//     const { id } = c.req.valid("param");

//     const task = await db.query.tasks.findFirst({
//         where: (task, { eq }) => eq(task.id, id),
//     });

//     if (!task) {
//         return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
//     }

//     return c.json(task, HttpStatusCodes.OK);
// };

// export const patch: AppRouteHandler<PatchRoute> = async (c) => {
//     const { id } = c.req.valid("param");
//     const updates = c.req.valid("json");

//     const [updatedTask] = await db.update(tasks)
//         .set(updates)
//         .where(eq(tasks.id, id))
//         .returning();

//     if (!updatedTask) {
//         return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
//     }

//     return c.json(updatedTask, HttpStatusCodes.OK);
// };

// export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
//     const { id } = c.req.valid("param");

//     const result = await db.delete(tasks)
//         .where(eq(tasks.id, id));

//     if (result.rowsAffected === 0) {
//         return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
//     }

//     return c.body(null, HttpStatusCodes.NO_CONTENT);
// };
