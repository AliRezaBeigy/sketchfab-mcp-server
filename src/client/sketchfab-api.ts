import axios from "axios";
import type {
  DownloadLinks,
  SearchOptions,
  SearchResponse,
  SketchfabCategory,
  SketchfabLicense,
  SketchfabModel,
} from "../types.js";

export class SketchfabApiClient {
  private apiKey: string;
  private static API_BASE = "https://api.sketchfab.com/v3";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getAuthHeader() {
    return { Authorization: `Token ${this.apiKey}` };
  }

  private handleApiError(error: unknown, context: string): never {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const messages: Record<number, string> = {
        400: "Model is not downloadable",
        401: "Invalid Sketchfab API key",
        403: "You do not have permission to download this model",
        404: context.includes("UID") ? context : `${context} not found`,
        429: "Sketchfab API rate limit exceeded. Try again later.",
      };
      throw new Error(
        messages[status] ?? `Sketchfab API error (${status}): ${error.message}`
      );
    }
    throw error instanceof Error ? error : new Error(String(error));
  }

  private parseSearchResponse(data: {
    results?: SketchfabModel[];
    next?: string;
    previous?: string;
    cursors?: { next?: string; previous?: string };
  }): SearchResponse {
    return {
      results: data.results ?? [],
      next: data.next,
      previous: data.previous,
      cursors: data.cursors,
    };
  }

  async searchModels(options: SearchOptions = {}): Promise<SearchResponse> {
    try {
      const {
        q,
        tags,
        categories,
        downloadable,
        count = 24,
        sortBy,
        license,
        animated,
        rigged,
        staffpicked,
        user,
        date,
        cursor,
      } = options;

      const params: Record<string, string | number | boolean | string[]> = {
        type: "models",
      };

      if (q) params.q = q;
      if (tags?.length) params.tags = tags;
      if (categories?.length) params.categories = categories;
      if (downloadable !== undefined) params.downloadable = downloadable;
      if (sortBy) params.sort_by = sortBy;
      if (license) params.license = license;
      if (animated !== undefined) params.animated = animated;
      if (rigged !== undefined) params.rigged = rigged;
      if (staffpicked !== undefined) params.staffpicked = staffpicked;
      if (user) params.user = user;
      if (date !== undefined) params.date = date;
      if (cursor) params.cursor = cursor;
      params.count = Math.min(count, 24);

      const response = await axios.get(`${SketchfabApiClient.API_BASE}/search`, {
        params,
        headers: this.getAuthHeader(),
      });

      return this.parseSearchResponse(response.data);
    } catch (error) {
      this.handleApiError(error, "Search request failed");
    }
  }

  async searchModelsByUrl(url: string): Promise<SearchResponse> {
    try {
      const response = await axios.get(url, {
        headers: this.getAuthHeader(),
      });
      return this.parseSearchResponse(response.data);
    } catch (error) {
      this.handleApiError(error, "Search pagination request failed");
    }
  }

  async listCategories(sortBy?: string): Promise<SketchfabCategory[]> {
    try {
      const params: Record<string, string> = {};
      if (sortBy) params.sort_by = sortBy;

      const response = await axios.get(
        `${SketchfabApiClient.API_BASE}/categories`,
        { params, headers: this.getAuthHeader() }
      );
      return response.data.results ?? [];
    } catch (error) {
      this.handleApiError(error, "Categories request failed");
    }
  }

  async listLicenses(): Promise<SketchfabLicense[]> {
    try {
      const response = await axios.get(
        `${SketchfabApiClient.API_BASE}/licenses`,
        { headers: this.getAuthHeader() }
      );
      return response.data.results ?? [];
    } catch (error) {
      this.handleApiError(error, "Licenses request failed");
    }
  }

  async getModel(uid: string): Promise<SketchfabModel> {
    try {
      const response = await axios.get(
        `${SketchfabApiClient.API_BASE}/models/${uid}`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error, `Model with UID ${uid}`);
    }
  }

  async getModelDownloadLink(uid: string): Promise<DownloadLinks> {
    try {
      const response = await axios.get(
        `${SketchfabApiClient.API_BASE}/models/${uid}/download`,
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      this.handleApiError(error, `Download link for model ${uid}`);
    }
  }

  async downloadModel(downloadUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(downloadUrl, {
        responseType: "arraybuffer",
        timeout: 300_000,
      });
      return Buffer.from(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          `Download error (${error.response.status}): ${error.message}`
        );
      }
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}
