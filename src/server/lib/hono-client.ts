import { hc } from "hono/client";
import type { HonoAppType } from "..";

export const api = hc<HonoAppType>("http://localhost:3000/api"); 