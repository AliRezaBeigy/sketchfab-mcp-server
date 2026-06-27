import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { NO_API_KEY_MESSAGE } from "../config.js";
import type { SketchfabApiClient } from "../client/sketchfab-api.js";
import { DOWNLOAD_FORMATS } from "../types.js";
import { pickDownloadFormat, saveDownloadedModel } from "../utils/download.js";
import { errorResponse, textResponse } from "../utils/response.js";

export function registerDownloadTool(
  server: McpServer,
  getClient: () => SketchfabApiClient | null
) {
  server.tool(
    "sketchfab-download",
    "Download a 3D model from Sketchfab",
    {
      modelId: z
        .string()
        .describe(
          "The unique ID of the Sketchfab model to download (must be downloadable)"
        ),
      format: z
        .enum(DOWNLOAD_FORMATS)
        .optional()
        .describe(
          "Preferred format to download the model in (defaults to gltf if available)"
        ),
      outputPath: z
        .string()
        .optional()
        .describe(
          "Local directory or file path to save the downloaded file (will use temp directory if not specified)"
        ),
    },
    async ({ modelId, format = "gltf", outputPath }) => {
      try {
        const client = getClient();
        if (!client) return textResponse(NO_API_KEY_MESSAGE);

        const model = await client.getModel(modelId);

        if (!model.isDownloadable) {
          return textResponse(`Model "${model.name}" is not downloadable.`);
        }

        const downloadLinks = await client.getModelDownloadLink(modelId);
        const { format: chosenFormat, link, fallback } = pickDownloadFormat(
          downloadLinks,
          format
        );

        const modelData = await client.downloadModel(link.url);
        const saveResult = saveDownloadedModel(
          model,
          modelId,
          chosenFormat,
          modelData,
          outputPath
        );

        const formatNote = fallback
          ? ` in ${chosenFormat} format (requested ${format} was not available)`
          : ` in ${chosenFormat} format`;

        return textResponse(
          `Downloaded model "${model.name}"${formatNote}.\n${saveResult}`
        );
      } catch (error) {
        return errorResponse("Error downloading model", error);
      }
    }
  );
}
