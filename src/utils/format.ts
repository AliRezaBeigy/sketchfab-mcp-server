import type {
  SketchfabCategory,
  SketchfabLicense,
  SketchfabModel,
} from "../types.js";

export function formatModelForDisplay(model: SketchfabModel): string {
  const lines = [
    `[Model] ${model.name}`,
    `ID: ${model.uid}`,
    `Creator: ${model.user?.username ?? "Unknown"}`,
    `Downloadable: ${model.isDownloadable ? "Yes" : "No"}`,
    `Thumbnail: ${model.thumbnails?.images?.[0]?.url ?? "None"}`,
  ];

  if (model.viewerUrl) lines.push(`Viewer: ${model.viewerUrl}`);
  if (model.description) lines.push(`Description: ${model.description}`);
  if (model.license) lines.push(`License: ${model.license}`);
  if (model.viewCount != null) lines.push(`Views: ${model.viewCount}`);
  if (model.likeCount != null) lines.push(`Likes: ${model.likeCount}`);
  if (model.faceCount != null) lines.push(`Faces: ${model.faceCount}`);
  if (model.vertexCount != null) lines.push(`Vertices: ${model.vertexCount}`);
  if (model.tags?.length) {
    lines.push(`Tags: ${model.tags.map((t) => t.slug).join(", ")}`);
  }
  if (model.categories?.length) {
    lines.push(`Categories: ${model.categories.map((c) => c.name).join(", ")}`);
  }

  return lines.join("\n");
}

export function formatSearchResult(model: SketchfabModel, index: number): string {
  const lines = [
    `[${index + 1}] ${model.name}`,
    `ID: ${model.uid}`,
    `Creator: ${model.user?.username ?? "Unknown"}`,
    `Downloadable: ${model.isDownloadable ? "Yes" : "No"}`,
  ];

  if (model.license) lines.push(`License: ${model.license}`);
  if (model.viewCount != null) lines.push(`Views: ${model.viewCount}`);
  if (model.likeCount != null) lines.push(`Likes: ${model.likeCount}`);

  const tags = model.tags?.slice(0, 5).map((t) => t.slug);
  if (tags?.length) lines.push(`Tags: ${tags.join(", ")}`);

  const thumbnail = model.thumbnails?.images?.[0]?.url;
  if (thumbnail) lines.push(`Thumbnail: ${thumbnail}`);
  if (model.viewerUrl) lines.push(`Viewer: ${model.viewerUrl}`);

  return lines.join("\n");
}

export function formatCategoryList(categories: SketchfabCategory[]): string {
  return categories
    .map(
      (category, index) =>
        `[${index + 1}] ${category.name}\nSlug: ${category.slug}`
    )
    .join("\n\n");
}

export function formatLicenseList(licenses: SketchfabLicense[]): string {
  return licenses
    .map((license, index) => {
      const lines = [
        `[${index + 1}] ${license.label}`,
        `Slug: ${license.slug}`,
      ];
      if (license.fullName) lines.push(`Full name: ${license.fullName}`);
      if (license.requirements) lines.push(`Requirements: ${license.requirements}`);
      return lines.join("\n");
    })
    .join("\n\n");
}

export function formatSearchSummary(
  resultCount: number,
  nextCursor?: string
): string {
  let summary = `Found ${resultCount} model${resultCount === 1 ? "" : "s"} on this page.`;
  if (nextCursor) {
    summary += `\nnextCursor: ${nextCursor}`;
    summary +=
      "\n(Pass nextCursor as the cursor parameter to fetch the next page.)";
  }
  summary +=
    "\nTip: Use sketchfab-list-categories or sketchfab-list-licenses for valid filter slugs.";
  return summary;
}
