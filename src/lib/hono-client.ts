import { hc } from "hono/client";
import type { HonoAppType } from "@/server";

export const api = hc<HonoAppType>("http://localhost:3000/api"); 