import { NextResponse } from "next/server";

const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Good Mythical Archive API",
    description:
      "RESTful API for accessing the Good Mythical Morning episode archive. Requires an API key for authentication.",
    version: "0.1.0",
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
          id: { type: "string", description: "Unique video identifier" },
          title: { type: "string", description: "Episode title" },
          description: { type: "string", description: "Episode description" },
          publishedAt: {
            type: "string",
            format: "date-time",
            description: "Publication date",
          },
          thumbnailUrl: { type: "string", description: "Thumbnail image URL" },
          videoId: { type: "string", description: "YouTube video ID" },
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
            description: "Number of results per page",
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
            description: "Search query to filter videos by title",
          },
        ],
        responses: {
          "200": {
            description: "A list of videos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Video" },
                    },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                  },
                },
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
