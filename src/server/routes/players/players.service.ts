import { vlrgg_url } from "@/server/lib/constants";
import type { TeamType } from "@/server/lib/types";
import type { PlayersRequestType, TeamViewResponsetype } from "@/server/lib/zod-types";
import { mapsWithID } from "@/server/lib/zod-types";

import axios from "axios";
import * as cheerio from "cheerio";
import { Element } from "domhandler";

/**
 * Retrieves player information from the VLR website based on pagination and filters.
 * @param {Object} pagination - Pagination settings.
 * @param {string} pagination.limit - The number of items per page or "all".
 * @param {number} pagination.page - The current page number.
 * @param {Object} filters - Filters to apply to the request.
 * @returns {Object} - Player information and pagination details.
 */

// const filters = {
//   event_series,
//   event,
//   country,
//   region,
//   minrounds,
//   minrating,
//   agent,
//   map,
//   timespan,
// };

type FilterTypes = Pick<PlayersRequestType, "event_series" |
  "event" |
  "country" |
  "region" |
  "minrounds" |
  "minrating" |
  "agent" |
  "map" |
  "timespan">


export async function getPlayers(
  pagination: {
    page: number;
    limit: number;
  },
  filters: FilterTypes,
) {
  // Calculate the start and end indices based on pagination
  const startIndex =
    pagination.limit !== 0 ? (pagination.page - 1) * pagination.limit : 0;
  const endIndex =
    pagination.limit !== 0 ? pagination.page * pagination.limit : undefined;

  const mapId = mapsWithID[filters.map];
  const region = filters.region

  const { data: body } = await axios.get(
    `${vlrgg_url}/stats/?event_group_id=${filters.event_series}&event_id=${filters.event}&region=${filters.region}&country=${filters.country}&min_rounds=${filters.minrounds}&min_rating=${filters.minrating}&agent=${filters.agent}&map_id=${mapId}&timespan=${filters.timespan}`,
  );
  const $ = cheerio.load(body);

  const teams: TeamType[] = [];

  if (region === "all") {
    // For the "all" region, parse the teams' data from the table rows
    $("tr")
      .has("td")
      .slice(startIndex, endIndex !== undefined ? endIndex : undefined)
      .map((i, el) => {
        if (!el) return;

        // Extract team information from the table row
        const name = $(el).find("td").first().next().attr("data-sort-value");
        const id = $(el)
          .find("td")
          .first()
          .next()
          .find("a")
          .attr("href")
          ?.split("/")[2];
        const url =
          vlrgg_url + $(el).find("td").first().next().find("a").attr("href");
        const img = $(el)
          .find("td")
          .first()
          .next()
          .find("img")
          .attr("src")
          ?.includes("/img/vlr")
          ? vlrgg_url + $(el).find("td").first().next().find("img").attr("src")
          : "https:" + $(el).find("td").first().next().find("img").attr("src");
        const country = $(el).find(".rank-item-team-country").text().trim();

        if (!name || !id) return;

        const team = {
          id,
          url,
          name,
          img,
          country,
        };

        teams.push(team);
      });
  } else {
    // For other specific regions, parse the teams' data from a different section of the page
    $(".mod-scroll")
      .find(".fa-certificate")
      .parent()
      .parent()
      .slice(startIndex, endIndex !== undefined ? endIndex : undefined)
      .map((i, el) => {
        if (!el) return;

        // Extract team information from the corresponding section
        const name = $(el).find("a").first().attr("data-sort-value");
        const id = $(el).find("a").first().attr("href")?.split("/")[2];
        const url = vlrgg_url + $(el).find("a").first().attr("href");
        const img = $(el)
          .find("a")
          .first()
          .find("img")
          .attr("src")
          ?.includes("/img/vlr")
          ? vlrgg_url + $(el).find("a").first().find("img").attr("src")
          : "https:" + $(el).find("a").first().find("img").attr("src");
        const country = $(el).find(".rank-item-team-country").text().trim();

        if (!name || !id) return;

        const team = {
          id,
          url,
          name,
          img,
          country,
        };

        teams.push(team);
      });
  }

  // Get the total number of pages
  const totalElements =
    region === "all"
      ? $("tr").has("td").length
      : $(".mod-scroll").find(".fa-certificate").parent().parent().length;
  const totalPages = Math.ceil(totalElements / pagination.limit);

  // Check if there is a next page
  const hasNextPage = pagination.page < totalPages;

  return {
    teams,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      totalElements,
      totalPages,
      hasNextPage,
    },
  };
}

/**
 * Retrieves team information from the VLR website.
 * @param {string} id - Team ID.
 * @returns {Object} - Team information.
 */


// type GetPlayerByIdReturntype = {
//   isNotfound: boolean
// } & TeamViewResponsetype


export async function getPlayerById(id: string) {
  let isNotfound = false

  const { data: body } = await axios.get(`${vlrgg_url}/team/${id}`)
    .then(res => res)
    .catch(err => {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          isNotfound = true
        }
      }
      return err
    });

  if (isNotfound) {
    return { isNotfound }
  }

  const $ = cheerio.load(body);

  const { data: body2 } = await axios.get(`${vlrgg_url}/team/matches/${id}/?group=completed`);
  const $matches = cheerio.load(body2);


  const roster: Element[] = [];
  const players: TeamViewResponsetype['players'] = [];
  const staff: TeamViewResponsetype['staff'] = [];
  const inactive: TeamViewResponsetype['inactive'] = [];

  const events: TeamViewResponsetype['events'] = [];

  const results: TeamViewResponsetype['results'] = [];
  const results_text: string[] = [];
  const upcoming: TeamViewResponsetype['upcoming'] = [];

  const info = {
    name: $(".team-header").find(".team-header-name h1").text().trim(),
    tag: $(".team-header").find(".team-header-name h2").text().trim(),
    logo: $(".team-header")
      .find(".team-header-logo img")
      .attr("src")
      ?.includes("/img/vlr")
      ? vlrgg_url + $(".team-header").find(".team-header-logo img").attr("src")
      : "https:" + $(".team-header").find(".team-header-logo img").attr("src"),
  };

  // Extract roster information
  $(".wf-card")
    .find(".team-roster-item")
    .map((i, el) => {
      roster.push(el);
    });

  // Extract events information
  $(".team-summary-container-2")
    .find(".wf-card")
    .has(".team-event-item")
    .find("a")
    .map((i, el) => {
      $(el)
        .children("div")
        .first()
        .children("div")
        .map((i, el) => {
          const result = $(el)
            .not(".text-of")
            .find("span")
            .first()
            .text()
            .trim()
            .split("\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t")
            .join("")
            .replace("–", " -  ");

          if (result !== "") {
            results_text.push(result);
          }
        });

      const id = $(el).attr("href")?.split("/")[2]
      const url = vlrgg_url + $(el).attr("href")
      const name = $(el).find(".text-of").text().trim()
      const year = $(el).children("div").last().text().trim()

      if (!id) return

      events.push({
        id,
        name,
        url,
        year,
        results: results_text,
      });
    });

  // Separate players and staff members in the roster
  roster.forEach((el) => {
    if ($(el).has(".wf-tag").text()) {
      // Staff member
      const staffMember = {
        id: $(el).find("a").attr("href")?.split("/")[2] || "",
        url: vlrgg_url + $(el).find("a").attr("href"),
        user: $(el).find(".team-roster-item-name-alias").text().trim(),
        name: $(el).find(".team-roster-item-name-real").text().trim(),
        tag: $(el).find(".wf-tag").text().trim(),
        img: $(el)
          .find(".team-roster-item-img")
          .find("img")
          .attr("src")
          ?.includes("owcdn")
          ? "https:" +
          $(el).find(".team-roster-item-img").find("img").attr("src")
          : vlrgg_url +
          $(el).find(".team-roster-item-img").find("img").attr("src"),
        country: $(el)
          .find(".team-roster-item-name-alias")
          .find("i")
          .attr("class")
          ?.split(" ")[1]
          .replace("mod-", "") || "",
      };
      if (staffMember.tag === "Inactive") {
        inactive.push(staffMember);
      } else {
        staff.push(staffMember);
      }
    } else {
      // Player
      const player = {
        id: $(el).find("a").attr("href")?.split("/")[2] || "",
        url: vlrgg_url + $(el).find("a").attr("href"),
        user: $(el).find(".team-roster-item-name-alias").text().trim(),
        name: $(el).find(".team-roster-item-name-real").text().trim(),
        img: $(el)
          .find(".team-roster-item-img")
          .find("img")
          .attr("src")
          ?.includes("owcdn")
          ? "https:" +
          $(el).find(".team-roster-item-img").find("img").attr("src")
          : vlrgg_url +
          $(el).find(".team-roster-item-img").find("img").attr("src"),
        country: $(el)
          .find(".team-roster-item-name-alias")
          .find("i")
          .attr("class")
          ?.split(" ")[1]
          .replace("mod-", "") || "",
      };
      players.push(player);
    }
  });

  // Extract upcoming matches information
  $(".mod-tbd")
    .parent()
    .map((i, el) => {
      const match_id = $(el).attr("href")?.split("/")[1] || "";
      const match_url = vlrgg_url + $(el).attr("href");
      const event_logo =
        "https:" + $(el).find("div").first().find("img").attr("src");
      const event_name = $(el)
        .find(".m-item-event")
        .find(".text-of")
        .text()
        .trim();
      const team1 = {
        name: $(el)
          .find(".m-item-team")
          .first()
          .find(".m-item-team-name")
          .text()
          .trim(),
        tag: $(el)
          .find(".m-item-team")
          .first()
          .find(".m-item-team-tag")
          .text()
          .trim(),
        logo: "https:" + $(el).find(".m-item-logo img").first().attr("src"),
      };
      const team2 = {
        name: $(el)
          .find(".m-item-team")
          .last()
          .find(".m-item-team-name")
          .text()
          .trim(),
        tag: $(el)
          .find(".m-item-team")
          .last()
          .find(".m-item-team-tag")
          .text()
          .trim(),
        logo: "https:" + $(el).find(".m-item-logo img").last().attr("src"),
      };

      const date = $(el).find(".m-item-date div").text().trim();
      const time = $(el).find(".m-item-date").text().replace(date, "").trim();
      const utcString = new Date(date + " " + time).toUTCString();
      const match = {
        match: {
          id: match_id,
          url: match_url,
        },
        event: {
          name: event_name,
          logo: event_logo,
        },
        teams: [team1, team2],
        utc: utcString,
      };
      upcoming.push(match);
    });

  // Extract past matches information
  $matches(".m-item-result")
    .not(".m-item-games-result")
    .parent()
    .map((i, el) => {
      const match_id = $(el).attr("href")?.split("/")[1] || "";
      const match_url = vlrgg_url + $(el).attr("href");
      const event_logo =
        "https:" + $(el).find(".m-item-thumb").find("img").attr("src");
      const event_name = $(el)
        .find(".m-item-event")
        .find(".text-of")
        .text()
        .trim();
      const team1 = {
        name: $(el)
          .find(".m-item-team")
          .first()
          .find(".m-item-team-name")
          .text()
          .trim(),
        tag: $(el)
          .find(".m-item-team")
          .first()
          .find(".m-item-team-tag")
          .text()
          .trim(),
        logo: $(el)
          .find(".m-item-logo img")
          .first()
          .attr("src")
          ?.includes("/img/vlr")
          ? vlrgg_url + $(el).find(".m-item-logo img").first().attr("src")
          : "https:" + $(el).find(".m-item-logo img").first().attr("src"),
        points: $(el).find(".m-item-result").find("span").first().text().trim(),
      };
      const team2 = {
        name: $(el)
          .find(".m-item-team")
          .last()
          .find(".m-item-team-name")
          .text()
          .trim(),
        tag: $(el)
          .find(".m-item-team")
          .last()
          .find(".m-item-team-tag")
          .text()
          .trim(),
        logo: $(el)
          .find(".m-item-logo img")
          .last()
          .attr("src")
          ?.includes("/img/vlr")
          ? vlrgg_url + $(el).find(".m-item-logo img").last().attr("src")
          : "https:" + $(el).find(".m-item-logo img").last().attr("src"),
        points: $(el).find(".m-item-result").find("span").last().text().trim(),
      };
      const date = $(el).find(".m-item-date div").text().trim();
      const time = $(el).find(".m-item-date").text().replace(date, "").trim();
      const utcString = new Date(date + " " + time).toUTCString();

      const match = {
        match: {
          id: match_id,
          url: match_url,
        },
        event: {
          name: event_name,
          logo: event_logo,
        },
        teams: [team1, team2],
        utc: utcString,
      };
      results.push(match);
    });

  const team = {
    isNotfound,
    info,
    players,
    staff,
    inactive,
    events,
    results,
    upcoming,
  };

  return team;
}
