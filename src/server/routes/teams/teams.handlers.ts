import type { AppRouteHandler } from "@/server/lib/types";
import { regionAliases, TeamViewResponsetype } from "@/server/lib/zod-types";

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { ListRoute, GetOneRoute } from "./teams.routes";
import { getTeams, getTeamById } from "./teams.service";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const req_param = c.req.valid("query");

  const page = parseInt(req_param.page || "1");
  const limit = parseInt(req_param.limit || "10");
  const pagination = {
    page,
    limit,
  };

  const regionQuery = req_param.region || "all";
  const region = regionAliases[regionQuery] || regionQuery;

  try {
    const {
      teams,
      pagination: { totalElements, totalPages, hasNextPage },
    } = await getTeams(pagination, region);

    return c.json(
      {
        region: regionQuery,
        size: teams.length,
        pagination: {
          page,
          limit,
          totalElements,
          totalPages,
          hasNextPage,
        },
        data: teams,
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    console.log("Server Error: ", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const { id } = c.req.valid("param");

  try {
    const data = await getTeamById(id);

    if (data.isNotfound) {
      return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND)
    }

    const json_data: TeamViewResponsetype = {
      info: data['info'],
      players: data['players'],
      staff: data['staff'],
      inactive: data['inactive'],
      events: data['events'],
      results: data['results'],
      upcoming: data['upcoming'],
    }

    return c.json(json_data, HttpStatusCodes.OK);
  } catch (error) {
    console.log("Server Error: ", error);
    return c.json(
      { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};