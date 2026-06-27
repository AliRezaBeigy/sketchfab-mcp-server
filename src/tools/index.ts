import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { SketchfabApiClient } from "../client/sketchfab-api.js";
import { registerDownloadTool } from "./download.js";
import { registerListCategoriesTool } from "./list-categories.js";
import { registerListLicensesTool } from "./list-licenses.js";
import { registerModelDetailsTool } from "./model-details.js";
import { registerSearchTool } from "./search.js";

export function registerTools(
  server: McpServer,
  getClient: () => SketchfabApiClient | null
) {
  registerSearchTool(server, getClient);
  registerModelDetailsTool(server, getClient);
  registerDownloadTool(server, getClient);
  registerListCategoriesTool(server, getClient);
  registerListLicensesTool(server, getClient);
}
