import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

export function isZipFile(buffer: Buffer): boolean {
  return (
    buffer.length >= 4 &&
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
    (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08)
  );
}

export function extractZipFile(zipBuffer: Buffer, outputDir: string): string[] {
  try {
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    fs.mkdirSync(outputDir, { recursive: true });
    zip.extractAllTo(outputDir, true);

    return zipEntries.map((entry) => path.join(outputDir, entry.entryName));
  } catch (error) {
    throw new Error(
      `Failed to extract ZIP file: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
