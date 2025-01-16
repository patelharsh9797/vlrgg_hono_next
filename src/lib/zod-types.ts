import z from "zod";

export const idParamsSchema = z.object({
    id: z.string(),
});

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
    page: z.string().default("1"),
    limit: z.string().default("10"),
    region: z.enum(regionAvailable).default("all"),
});

export type TeamRequestType = z.infer<typeof teamRequestSchema>;

export const teamSchema = z.object({
    id: z.string(),
    url: z.string().url(),
    name: z.string(),
    img: z.string().url(),
    country: z.string(),
});

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
});

export type TeamResponseType = z.infer<typeof teamResponseSchema>;

const playerSchema = teamSchema.extend({
    user: z.string(),
});

const staffSchema = playerSchema.extend({
    tag: z.string(),
});

const eventSchema = teamSchema.omit({ country: true, img: true }).extend({
    year: z.string(),
    results: z.array(z.string()),
});

const teamResultSchema = z.object({
    utc: z.string(),
    match: z.object({
        id: z.string(),
        url: z.string().url(),
    }),
    event: z.object({
        name: z.string(),
        logo: z.string().url(),
    }),
    teams: z.array(
        z.object({
            name: z.string(),
            tag: z.string(),
            logo: z.string().url(),
            points: z.string(),
        })
    ),
});

const teamUpcomingSchema = teamResultSchema.extend({
    teams: z.array(
        z.object({
            name: z.string(),
            tag: z.string(),
            logo: z.string().url(),
        })
    ),
});

export const teamViewResponseSchema = z.object({
    info: z.object({
        name: z.string(),
        tag: z.string(),
        logo: z.string().url(),
    }),
    players: z.array(playerSchema),
    staff: z.array(staffSchema),
    inactive: z.array(staffSchema),
    events: z.array(eventSchema),
    results: z.array(teamResultSchema),
    upcoming: z.array(teamUpcomingSchema),
});

export type TeamViewResponsetype = z.infer<typeof teamViewResponseSchema>;

export const agentAvailable = [
    "All",
    "Astra",
    "Breach",
    "Brimstone",
    "Chamber",
    "Clove",
    "Cypher",
    "Deadlock",
    "Fade",
    "Gekko",
    "Harbor",
    "Iso",
    "Jett",
    "Kayo",
    "Killjoy",
    "Neon",
    "Omen",
    "Phoenix",
    "Raze",
    "Reyna",
    "Sage",
    "Skye",
    "Sova",
    "Viper",
    "Vyse",
    "Yoru",
] as const;


export const mapsAvailable = [
    "All",
    "Abyss",
    "Ascent",
    "Bind",
    "Breeze",
    "Fracture",
    "Haven",
    "Icebox",
    "Lotus",
    "Pearl",
    "Split",
    "Sunset",
] as const;

type MapsKey = (typeof mapsAvailable)[number];
export const mapsWithID: Record<MapsKey, string> = {
    "All": "all",
    "Abyss": "13",
    "Ascent": "5",
    "Bind": "1",
    "Breeze": "8",
    "Fracture": "9",
    "Haven": "2",
    "Icebox": "6",
    "Lotus": "11",
    "Pearl": "10",
    "Split": "3",
    "Sunset": "12",
}

export const timeAvailable = ["30d", "60d", "90d", "all"] as const

export const playersRequestSchema = z.object({
    page: z.string().default("1"),
    limit: z.string().default("10"),
    event_series: z.string().default("all"),
    event: z.string().default("all"),
    region: z.enum(regionAvailable).default("all"),
    country: z.enum(regionAvailable).default("all"),
    minrounds: z.string().default("200"),
    minrating: z.string().default("1550"),
    agent: z.enum(agentAvailable).default("All"),
    map: z.enum(mapsAvailable).default("All"),
    timespan: z.enum(timeAvailable).default("all"),
});

export type PlayersRequestType = z.infer<typeof playersRequestSchema>;