# sketchfab-mcp-server

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-6366F1?style=flat)](https://modelcontextprotocol.io)
[![Sketchfab](https://img.shields.io/badge/Sketchfab-1CAAD9?style=flat&logo=sketchfab&logoColor=white)](https://sketchfab.com)



A [Model Context Protocol](https://modelcontextprotocol.io) server for [Sketchfab](https://sketchfab.com). Search, browse, inspect, and download 3D models from Cursor, Claude Desktop, and other MCP clients.

> **API key required:** All tools need a valid **Sketchfab API token**. Create one at [sketchfab.com/settings/password](https://sketchfab.com/settings/password) (API token section). Pass it via `--api-key`, the `SKETCHFAB_API_KEY` environment variable, or in your MCP client config.

## Quick Start

### Prerequisites

- **Node.js 18+** — Runtime for the MCP server
- **Yarn** — Package manager (or use `npm` / `pnpm` equivalently)
- **Sketchfab API token** — Required for search, model details, categories, licenses, and downloads
- **Git** — For cloning the repository

### Build from Source

**Clone the repository:**

```bash
git clone https://github.com/AliRezaBeigy/sketchfab-mcp-server.git
cd sketchfab-mcp-server
```

**Install dependencies and build:**

```bash
yarn install
yarn build
```

**Run locally (stdio transport):**

```bash
# Option A: environment variable
export SKETCHFAB_API_KEY="your-api-token-here"
yarn start

# Option B: CLI flag
node build/index.js --api-key "your-api-token-here"
```

**Development (no build step):**

```bash
export SKETCHFAB_API_KEY="your-api-token-here"
yarn dev
```

### Configure an MCP Client

Add the server to your MCP client settings. Use the absolute path to `build/index.js` on your machine.

**Cursor** — edit `~/.cursor/mcp.json` (or project-level `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "sketchfab": {
      "command": "node",
      "args": [
        "/absolute/path/to/sketchfab-mcp-server/build/index.js"
      ],
      "env": {
        "SKETCHFAB_API_KEY": "your-api-token-here"
      }
    }
  }
}
```

**Claude Desktop** — edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "sketchfab": {
      "command": "node",
      "args": [
        "/absolute/path/to/sketchfab-mcp-server/build/index.js"
      ],
      "env": {
        "SKETCHFAB_API_KEY": "your-api-token-here"
      }
    }
  }
}
```

Alternatively, pass the API key as a CLI argument instead of `env`:

```json
"args": [
  "/absolute/path/to/sketchfab-mcp-server/build/index.js",
  "--api-key",
  "your-api-token-here"
]
```

Restart the MCP client after saving. The server communicates over **stdio**; diagnostics are written to stderr only.

### Windows

On Windows, use backslashes or forward slashes in paths inside `mcp.json`. PowerShell example for a one-off run:

```powershell
$env:SKETCHFAB_API_KEY = "your-api-token-here"
node build\index.js
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `sketchfab-search` | Search models by keywords, tags, categories, license, user, and more |
| `sketchfab-model-details` | Full metadata for a model (stats, license, tags, downloadability) |
| `sketchfab-download` | Download a model as glTF, GLB, USDZ, or source (ZIP auto-extracts) |
| `sketchfab-list-categories` | List category slugs for use in search filters |
| `sketchfab-list-licenses` | List license slugs for use in search filters |

**Search filters** include downloadable-only, animated, rigged, staff-picked, sort order, date range (1/7/31 days), and cursor-based pagination (up to 24 results per page).

**Download formats:** `gltf` (default), `glb`, `usdz`, `source`. If the requested format is unavailable, the server falls back to the first available format. ZIP archives (common for glTF/source) are saved and extracted automatically.

## Features

- **Sketchfab API v3** — Search, browse, and download via the official REST API
- **Rich search** — Tags, categories, licenses, sort, pagination, and creator filters
- **Model downloads** — glTF/GLB/USDZ/source with automatic ZIP extraction
- **MCP-native** — Works with Cursor, Claude Desktop, and any stdio MCP host
- **TypeScript** — Typed tools with Zod parameter validation

## License

See the project license file when available.

## Acknowledgments

- [Sketchfab](https://sketchfab.com) — 3D model platform and API
- [Model Context Protocol](https://modelcontextprotocol.io) — Open standard for AI tool integration
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk) — Official TypeScript MCP SDK

---

**Made with ❤️ for 3D creators and AI-assisted workflows**
