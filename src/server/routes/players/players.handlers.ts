import type { AppRouteHandler } from "@/server/lib/types";

import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { ListRoute } from "./players.routes";
import { getPlayers } from "./players.service";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const req_param = c.req.valid("query");

  const page = parseInt(req_param.page || "1");
  const limit = parseInt(req_param.limit || "10");
  const pagination = {
    page,
    limit,
  };

  const region = req_param.region || "all";

  const agent = req_param.agent || "All";

  const map = req_param.map || "All";

  const event = req_param.event || "all";
  const event_series = req_param.event_series || "all";
  const country = req_param.country || "all";
  const minrounds = req_param.minrounds || "200";
  const minrating = req_param.minrating || "1550";
  const timespan = req_param.timespan || "60d";


  const filters = {
    event_series,
    event,
    country,
    region,
    minrounds,
    minrating,
    agent,
    map,
    timespan,
  };

  try {
    const {
      teams,
      pagination: { totalElements, totalPages, hasNextPage },
    } = await getPlayers(pagination, filters);

    return c.json(
      {
        region: region,
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

// export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
//   const { id } = c.req.valid("param");

//   try {
//     const data = await getTeamById(id);

//     if (data.isNotfound) {
//       return c.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND)
//     }

//     const json_data: TeamViewResponsetype = {
//       info: data['info'],
//       players: data['players'],
//       staff: data['staff'],
//       inactive: data['inactive'],
//       events: data['events'],
//       results: data['results'],
//       upcoming: data['upcoming'],
//     }

//     return c.json(json_data, HttpStatusCodes.OK);
//   } catch (error) {
//     console.log("Server Error: ", error);
//     return c.json(
//       { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
//       HttpStatusCodes.INTERNAL_SERVER_ERROR,
//     );
//   }
// };