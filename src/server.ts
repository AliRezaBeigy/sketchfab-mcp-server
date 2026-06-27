import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apiKey, SERVER_NAME, SERVER_VERSION } from "./config.js";
import { SketchfabApiClient } from "./client/sketchfab-api.js";
import { registerTools } from "./tools/index.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  const getClient = (): SketchfabApiClient | null =>
    apiKey ? new SketchfabApiClient(apiKey) : null;

  registerTools(server, getClient);

  return server;
}
