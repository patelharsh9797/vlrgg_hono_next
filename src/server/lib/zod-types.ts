import z from "zod";

export const regionAvailable = [
    "na",
    "eu",
    "br",
    "ap",
    "asia",
    "pacific",
    "kr",
    "ch",
    "jp",
    "las",
    "lan",
    "oce",
    "mena",
    "gc",
    "world",
    "all",
] as const;

type RegionKey = (typeof regionAvailable)[number];

export const regionAliases: Record<RegionKey, string> = {
    na: "north-america",
    eu: "europe",
    br: "brazil",
    ap: "asia-pacific",
    asia: "asia-pacific",
    pacific: "asia-pacific",
    kr: "korea",
    ch: "china",
    jp: "japan",
    las: "la-s",
    lan: "la-n",
    oce: "oceania",
    mena: "mena",
    gc: "gc",
    world: "all",
    all: "all",
};


export const teamRequestSchema = z.object({
    page: z.number().default(1),
    limit: z.number().default(10),
    region: z.enum(regionAvailable).default("all"),
})

export type TeamRequestType = z.infer<typeof teamRequestSchema>;

export const teamSchema = z.object({
    id: z.string(),
    url: z.string(),
    name: z.string(),
    img: z.string(),
    country: z.string(),
})

export type TeamType = z.infer<typeof teamSchema>;

export const teamResponseSchema = z.object({
    region: z.enum(regionAvailable).default("all"),
    size: z.number(),
    pagination: z.object({
        page: z.number(),
        limit: z.number(),
        totalElements: z.number(),
        totalPages: z.number(),
        hasNextPage: z.boolean(),
    }),
    data: z.array(teamSchema),
})

export type TeamResponseType = z.infer<typeof teamResponseSchema>;
