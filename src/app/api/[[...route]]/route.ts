import { handle } from "hono/vercel";
import hono_server from "@/server";

// export const runtime = "edge";

console.log("-----------hono_server----------", hono_server)

export const GET = handle(hono_server);
export const POST = handle(hono_server);
