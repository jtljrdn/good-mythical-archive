import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Good Mythical Archive API",
    description:
      "RESTful API for accessing the Good Mythical Morning episode archive. Requires an API key for authentication.",
    version: "0.2.0",
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
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description: "API key for authentication",
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
            schema: { type: "string" },
            description: "Search query to filter videos by title",
          },
          {
            name: "season",
            in: "query",
            schema: { type: "integer" },
            description: "Filter by season number",
          },
          {
            name: "category",
            in: "query",
            schema: { type: "string" },
            description: "Filter by category",
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
        },
      },
    },
  },
};

export function GET() {
  return NextResponse.json(openApiSpec);
}
