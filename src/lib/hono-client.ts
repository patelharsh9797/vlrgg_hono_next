import { hc } from "hono/client";
import type { HonoAppType } from "@/server";
import { getBaseUrl } from "@/utils";

const url = getBaseUrl() + "/api";

console.log("URL: ", url)

export const api = hc<HonoAppType>(url); 