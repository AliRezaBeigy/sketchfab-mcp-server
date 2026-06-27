import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export const SERVER_NAME = "mcp-server-sketchfab";
export const SERVER_VERSION = "1.0.0";

export const NO_API_KEY_MESSAGE =
  "No Sketchfab API key provided. Pass --api-key or set the SKETCHFAB_API_KEY environment variable.";

const argv = yargs(hideBin(process.argv))
  .option("api-key", {
    type: "string",
    describe: "Sketchfab API key (or set SKETCHFAB_API_KEY env var)",
  })
  .help(false)
  .version(false)
  .parseSync();

export const apiKey = argv.apiKey ?? process.env.SKETCHFAB_API_KEY ?? "";
