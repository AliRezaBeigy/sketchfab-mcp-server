import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { NO_API_KEY_MESSAGE } from "../config.js";
import type { SketchfabApiClient } from "../client/sketchfab-api.js";
import { LICENSE_SLUGS, SEARCH_SORT_OPTIONS } from "../types.js";
import {
  formatSearchResult,
  formatSearchSummary,
} from "../utils/format.js";
import { errorResponse, textResponse } from "../utils/response.js";

export function registerSearchTool(
  server: McpServer,
  getClient: () => SketchfabApiClient | null
) {
  server.tool(
    "sketchfab-search",
    "Search for 3D models on Sketchfab based on keywords and filters",
    {
      query: z
        .string()
        .optional()
        .describe(
          'Text search query (e.g., "car", "house", "character") to find relevant models'
        ),
      tags: z
        .array(z.string())
        .optional()
        .describe('Filter by specific tags (e.g., ["animated", "rigged", "pbr"])'),
      categories: z
        .array(z.string())
        .optional()
        .describe(
          'Filter by category slugs (e.g., ["characters", "architecture", "vehicles"]). Use sketchfab-list-categories for valid slugs.'
        ),
      downloadable: z
        .boolean()
        .optional()
        .describe(
          "Set to true to show only downloadable models, false to show all models"
        ),
      sortBy: z
        .enum(SEARCH_SORT_OPTIONS)
        .optional()
        .describe(
          "Sort order (e.g., -likeCount for most liked). Omit for relevance."
        ),
      license: z
        .enum(LICENSE_SLUGS)
        .optional()
        .describe(
          'Filter by license slug (e.g., "cc0", "by-nc"). Use sketchfab-list-licenses for valid slugs.'
        ),
      animated: z
        .boolean()
        .optional()
        .describe("Set to true to show only animated models"),
      rigged: z
        .boolean()
        .optional()
        .describe("Set to true to show only rigged models"),
      staffpicked: z
        .boolean()
        .optional()
        .describe("Set to true to show only staff-picked models"),
      user: z
        .string()
        .optional()
        .describe("Filter by creator username"),
      date: z
        .union([z.literal(1), z.literal(7), z.literal(31)])
        .optional()
        .describe("Limit to models published within the last N days (1, 7, or 31)"),
      cursor: z
        .string()
        .optional()
        .describe(
          "Pagination cursor from a previous search response (nextCursor field)"
        ),
      limit: z
        .number()
        .optional()
        .describe("Maximum number of results to return (1-24, default: 10)"),
    },
    async ({
      query,
      tags,
      categories,
      downloadable,
      sortBy,
      license,
      animated,
      rigged,
      staffpicked,
      user,
      date,
      cursor,
      limit,
    }) => {
      try {
        if (
          !query &&
          !tags?.length &&
          !categories?.length &&
          !user
        ) {
          return textResponse(
            "Please provide at least one search parameter: query, tags, categories, or user."
          );
        }

        const client = getClient();
        if (!client) return textResponse(NO_API_KEY_MESSAGE);

        const searchResults = await client.searchModels({
          q: query,
          tags,
          categories,
          downloadable,
          sortBy,
          license,
          animated,
          rigged,
          staffpicked,
          user,
          date,
          cursor,
          count: limit ?? 10,
        });

        if (!searchResults.results.length) {
          return textResponse(
            "No models found matching your search criteria. Try different keywords or filters. Use sketchfab-list-categories or sketchfab-list-licenses for valid slugs."
          );
        }

        const formattedResults = searchResults.results
          .map(formatSearchResult)
          .join("\n\n");

        const nextCursor = searchResults.cursors?.next;
        const summary = formatSearchSummary(
          searchResults.results.length,
          nextCursor
        );

        return textResponse(`${summary}\n\n${formattedResults}`);
      } catch (error) {
        return errorResponse("Error searching Sketchfab", error);
      }
    }
  );
}
