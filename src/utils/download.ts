import fs from "fs";
import path from "path";
import os from "os";
import type { DownloadFormat, DownloadLinks, SketchfabModel } from "../types.js";
import { DOWNLOAD_FORMATS } from "../types.js";
import { extractZipFile, isZipFile } from "./zip.js";

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "_");
}

export function resolveSavePath(
  model: SketchfabModel,
  modelId: string,
  format: string,
  outputPath?: string
): string {
  const filename = `${sanitizeFilename(model.name)}_${modelId}.${format}`;
  return outputPath ?? path.join(os.tmpdir(), filename);
}

export function saveDownloadedModel(
  model: SketchfabModel,
  modelId: string,
  format: string,
  modelData: Buffer,
  outputPath?: string
): string {
  const savePath = resolveSavePath(model, modelId, format, outputPath);
  const saveDir = path.dirname(savePath);

  if (isZipFile(modelData)) {
    const extractDir = path.join(
      saveDir,
      `${path.basename(savePath, path.extname(savePath))}_extracted`
    );
    const extractedFiles = extractZipFile(modelData, extractDir);
    fs.writeFileSync(savePath, modelData);
    return (
      `The file was a ZIP archive and has been automatically extracted.\n` +
      `Original ZIP saved to: ${savePath}\n` +
      `Extracted files in: ${extractDir}\n` +
      `Extracted ${extractedFiles.length} files.`
    );
  }

  fs.writeFileSync(savePath, modelData);
  return `Saved to: ${savePath}`;
}

export function pickDownloadFormat(
  downloadLinks: DownloadLinks,
  requested: DownloadFormat
): {
  format: DownloadFormat;
  link: { url: string; expires: number };
  fallback: boolean;
} {
  const requestedLink = downloadLinks[requested];
  if (requestedLink) {
    return { format: requested, link: requestedLink, fallback: false };
  }

  const available = DOWNLOAD_FORMATS.filter((f) => downloadLinks[f]);
  if (available.length === 0) {
    throw new Error("No download formats available for this model.");
  }

  const format = available[0];
  return { format, link: downloadLinks[format]!, fallback: true };
}
