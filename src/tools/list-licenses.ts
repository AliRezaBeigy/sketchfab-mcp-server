import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { NO_API_KEY_MESSAGE } from "../config.js";
import type { SketchfabApiClient } from "../client/sketchfab-api.js";
import { formatLicenseList } from "../utils/format.js";
import { errorResponse, textResponse } from "../utils/response.js";

export function registerListLicensesTool(
  server: McpServer,
  getClient: () => SketchfabApiClient | null
) {
  server.tool(
    "sketchfab-list-licenses",
    "List Sketchfab model licenses with slugs for use in search filters",
    {},
    async () => {
      try {
        const client = getClient();
        if (!client) return textResponse(NO_API_KEY_MESSAGE);

        const licenses = await client.listLicenses();

        if (!licenses.length) {
          return textResponse("No licenses found.");
        }

        return textResponse(
          `Available licenses (${licenses.length}). Use the slug value in sketchfab-search license filter:\n\n${formatLicenseList(licenses)}`
        );
      } catch (error) {
        return errorResponse("Error listing Sketchfab licenses", error);
      }
    }
  );
}
