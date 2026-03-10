import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Good Mythical Archive API",
    description:
      "RESTful API for accessing the Good Mythical Morning episode archive. Requires an API key for authentication.",
    version: "0.3.0",
  },
  servers: [
    {
      url: "/api",
      description: "API server",
    },
  ],
  security: [
    {
      apiKey: [],
    },
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: "http",
        scheme: "bearer",
        description:
          "API key passed as a Bearer token in the Authorization header",
      },
    },
    schemas: {
      Video: {
        type: "object",
        properties: {
          episode: {
            type: "integer",
            description: "Overall episode number (primary key)",
          },
          numberInSeason: {
            type: "string",
            nullable: true,
            description: "Episode number within its season",
          },
          title: { type: "string", nullable: true, description: "Episode title" },
          description: {
            type: "string",
            nullable: true,
            description: "Episode description",
          },
          length: {
            type: "string",
            nullable: true,
            description: 'Duration (e.g. "18:42")',
          },
          gmmoreTitle: {
            type: "string",
            nullable: true,
            description: "Good Mythical MORE episode title",
          },
          releaseDate: {
            type: "string",
            nullable: true,
            description: "Release date",
          },
          guests: {
            type: "string",
            nullable: true,
            description: "Guest names",
          },
          videoUrl: {
            type: "string",
            nullable: true,
            description: "YouTube video URL",
          },
          gmmoreUrl: {
            type: "string",
            nullable: true,
            description: "Good Mythical MORE video URL",
          },
          gmmoreLength: {
            type: "string",
            nullable: true,
            description: "Good Mythical MORE duration",
          },
          season: {
            type: "integer",
            nullable: true,
            description: "Season number",
          },
          category: {
            type: "string",
            nullable: true,
            description: "Episode category",
          },
          viewCount: {
            type: "integer",
            nullable: true,
            description: "YouTube view count",
          },
          gmmEpisodeNumber: {
            type: "integer",
            nullable: true,
            description: "Official GMM episode number",
          },
          thumbnailUrl: {
            type: "string",
            nullable: true,
            description: "YouTube thumbnail URL (computed from videoUrl)",
          },
        },
      },
      PaginatedResponse: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Video" },
          },
          total: { type: "integer", description: "Total matching episodes" },
          page: { type: "integer", description: "Current page number" },
          limit: { type: "integer", description: "Results per page" },
          totalPages: { type: "integer", description: "Total number of pages" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", description: "Error message" },
        },
      },
    },
  },
  paths: {
    "/gmm/videos": {
      get: {
        operationId: "getVideos",
        summary: "List GMM videos",
        description:
          "Retrieve a paginated list of Good Mythical Morning videos.",
        tags: ["Videos"],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 20 },
            description: "Number of results per page (max 100)",
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string", maxLength: 200 },
            description:
              "Search query to filter videos by title (max 200 characters). Uses substring matching by default, or trigram similarity when fuzzy=true.",
          },
          {
            name: "fuzzy",
            in: "query",
            schema: { type: "boolean", default: false },
            description:
              "Enable fuzzy search. When true, uses trigram similarity matching to find titles even with typos or partial matches. Results are always sorted by relevance regardless of the sort parameter. Requires the search parameter.",
          },
          {
            name: "seasons",
            in: "query",
            schema: { type: "string" },
            description: "Comma-separated list of season numbers to filter by (e.g. \"1,2,3\")",
          },
          {
            name: "categories",
            in: "query",
            schema: { type: "string" },
            description: "Comma-separated list of categories to filter by",
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            description: "Sort order by episode number. Ignored when fuzzy=true (results are sorted by relevance instead).",
          },
        ],
        responses: {
          "200": {
            description: "A paginated list of videos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedResponse" },
              },
            },
          },
          "401": {
            description: "Unauthorized - invalid or missing API key",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
    "/episodes": {
      get: {
        operationId: "getEpisodes",
        summary: "List episodes (public)",
        description:
          "Retrieve a paginated list of Good Mythical Morning episodes. This endpoint does not require authentication.",
        tags: ["Episodes"],
        security: [],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
            description: "Page number",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", default: 24 },
            description: "Number of results per page (max 100)",
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string", maxLength: 200 },
            description:
              "Search query to filter episodes by title (max 200 characters). Uses substring matching by default, or trigram similarity when fuzzy=true.",
          },
          {
            name: "fuzzy",
            in: "query",
            schema: { type: "boolean", default: false },
            description:
              "Enable fuzzy search. When true, uses trigram similarity matching to find titles even with typos or partial matches. Results are always sorted by relevance regardless of the sort parameter. Requires the search parameter.",
          },
          {
            name: "seasons",
            in: "query",
            schema: { type: "string" },
            description: "Comma-separated list of season numbers to filter by (e.g. \"1,2,3\")",
          },
          {
            name: "categories",
            in: "query",
            schema: { type: "string" },
            description: "Comma-separated list of categories to filter by",
          },
          {
            name: "sort",
            in: "query",
            schema: { type: "string", enum: ["asc", "desc"], default: "desc" },
            description: "Sort order by episode number. Ignored when fuzzy=true (results are sorted by relevance instead).",
          },
        ],
        responses: {
          "200": {
            description: "A paginated list of episodes",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedResponse" },
              },
            },
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};

export function GET() {
  return NextResponse.json(openApiSpec);
}
