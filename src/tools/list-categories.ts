import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { NO_API_KEY_MESSAGE } from "../config.js";
import type { SketchfabApiClient } from "../client/sketchfab-api.js";
import { formatCategoryList } from "../utils/format.js";
import { errorResponse, textResponse } from "../utils/response.js";

export function registerListCategoriesTool(
  server: McpServer,
  getClient: () => SketchfabApiClient | null
) {
  server.tool(
    "sketchfab-list-categories",
    "List Sketchfab model categories with slugs for use in search filters",
    {
      sortBy: z
        .enum(["slug", "-slug"])
        .optional()
        .describe("Optional sort order for the category list"),
    },
    async ({ sortBy }) => {
      try {
        const client = getClient();
        if (!client) return textResponse(NO_API_KEY_MESSAGE);

        const categories = await client.listCategories(sortBy);

        if (!categories.length) {
          return textResponse("No categories found.");
        }

        return textResponse(
          `Available categories (${categories.length}). Use the slug value in sketchfab-search categories filter:\n\n${formatCategoryList(categories)}`
        );
      } catch (error) {
        return errorResponse("Error listing Sketchfab categories", error);
      }
    }
  );
}
