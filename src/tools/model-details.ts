import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { NO_API_KEY_MESSAGE } from "../config.js";
import type { SketchfabApiClient } from "../client/sketchfab-api.js";
import { formatModelForDisplay } from "../utils/format.js";
import { errorResponse, textResponse } from "../utils/response.js";

export function registerModelDetailsTool(
  server: McpServer,
  getClient: () => SketchfabApiClient | null
) {
  server.tool(
    "sketchfab-model-details",
    "Get detailed information about a specific Sketchfab model",
    {
      modelId: z
        .string()
        .describe(
          "The unique ID of the Sketchfab model (found in URLs or search results)"
        ),
    },
    async ({ modelId }) => {
      try {
        const client = getClient();
        if (!client) return textResponse(NO_API_KEY_MESSAGE);

        const model = await client.getModel(modelId);
        return textResponse(formatModelForDisplay(model));
      } catch (error) {
        return errorResponse("Error getting model details", error);
      }
    }
  );
}
