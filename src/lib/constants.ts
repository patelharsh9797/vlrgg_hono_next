import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

export const vlrgg_url = "https://www.vlr.gg";

export const ZOD_ERROR_MESSAGES = {
    REQUIRED: "Required",
    EXPECTED_NUMBER: "Expected number, received nan",
    NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
    INVALID_UPDATES: "invalid_updates",
};

export const notFoundSchema = createMessageObjectSchema(HttpStatusPhrases.NOT_FOUND).openapi({
    example: {
        message: HttpStatusPhrases.NOT_FOUND,
    },
});