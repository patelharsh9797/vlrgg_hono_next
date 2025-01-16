import env from "@/env";
import { apiReference } from "@scalar/hono-api-reference";

import packageJSON from "@/../package.json" with { type: "json" };
import type { AppOpenAPI } from "@/lib/types";

export default function configureOpenAPI(app: AppOpenAPI) {
    app.doc("/doc", {
        openapi: "3.0.0",
        info: {
            version: packageJSON.version,
            title: "Tasks API",
        },
    });

    app.get(
        "/reference",
        apiReference({
            theme: "kepler",
            layout: "classic",
            defaultHttpClient: {
                targetKey: "javascript",
                clientKey: "fetch",
            },
            spec: {
                url: `${env.API_BASE_PATH}/doc`,
            },
        }),
    );
}