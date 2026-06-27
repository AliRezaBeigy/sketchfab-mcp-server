export const DOWNLOAD_FORMATS = ["gltf", "glb", "usdz", "source"] as const;
export type DownloadFormat = (typeof DOWNLOAD_FORMATS)[number];

export const SEARCH_SORT_OPTIONS = [
  "likeCount",
  "-likeCount",
  "viewCount",
  "-viewCount",
  "publishedAt",
  "-publishedAt",
  "processedAt",
  "-processedAt",
] as const;
export type SearchSortOption = (typeof SEARCH_SORT_OPTIONS)[number];

export const LICENSE_SLUGS = [
  "by",
  "by-sa",
  "by-nd",
  "by-nc",
  "by-nc-sa",
  "by-nc-nd",
  "cc0",
  "ed",
  "st",
] as const;
export type LicenseSlug = (typeof LICENSE_SLUGS)[number];

export const SEARCH_DATE_OPTIONS = [1, 7, 31] as const;
export type SearchDateOption = (typeof SEARCH_DATE_OPTIONS)[number];

export interface SearchOptions {
  q?: string;
  tags?: string[];
  categories?: string[];
  downloadable?: boolean;
  count?: number;
  sortBy?: SearchSortOption;
  license?: LicenseSlug;
  animated?: boolean;
  rigged?: boolean;
  staffpicked?: boolean;
  user?: string;
  date?: SearchDateOption;
  cursor?: string;
}

export interface SearchResponse {
  results: SketchfabModel[];
  next?: string;
  previous?: string;
  cursors?: { next?: string; previous?: string };
}

export interface SketchfabModel {
  uid: string;
  name: string;
  description?: string;
  viewerUrl?: string;
  thumbnails?: {
    images?: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  user?: {
    username: string;
    displayName?: string;
  };
  isDownloadable: boolean;
  downloadCount?: number;
  viewCount?: number;
  likeCount?: number;
  license?: string;
  createdAt?: string;
  faceCount?: number;
  vertexCount?: number;
  tags?: Array<{ slug: string }>;
  categories?: Array<{ name: string; slug: string }>;
}

export interface SketchfabCategory {
  uid: string;
  name: string;
  slug: string;
}

export interface SketchfabLicense {
  slug: string;
  label: string;
  fullName?: string;
  requirements?: string;
  url?: string;
}

export interface DownloadLinks {
  gltf?: { url: string; expires: number };
  usdz?: { url: string; expires: number };
  glb?: { url: string; expires: number };
  source?: { url: string; expires: number };
}
