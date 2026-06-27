#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { apiKey } from "./config.js";
import { createServer } from "./server.js";

async function main() {
  // MCP uses stdout for JSON-RPC; log diagnostics to stderr only
  if (apiKey) {
    console.error("Sketchfab API key provided");
  } else {
    console.error(
      "No Sketchfab API key provided. Some functionality may be limited."
    );
  }

  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sketchfab MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
