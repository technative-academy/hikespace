import { createDocument } from "zod-openapi";
import { z } from "zod";
import { UserSchema, CreateUserSchema } from "./schemas/users.zod.js";

export const openapiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Test Express API",
    version: "1.0.0"
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/": {
      get: {
        summary: "Hello endpoint",
        responses: {
          "200": {
            description: "OK",
            content: {
              "text/plain": {
                schema: { type: "string", example: "Hello from Express" }
              }
            }
          }
        }
      }
    },

    "/posts": {
      get: {
        summary: "List posts",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Post" }
                },
                example: [
                  {
                    post_id: 1,
                    owner_id: 1,
                    description: "walking in Brighton!",
                    route: [
                      [-0.141176, 50.828873],
                      [-0.1422, 50.8293],
                      [-0.1431, 50.8302]
                    ],
                    location_name: "Brighton",
                    caption: "hi, this is a post about walking in Brighton!"
                  }
                ]
              }
            }
          }
        }
      }
    },

    "/posts/{id}": {
      get: {
        summary: "Get post by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", example: 1 }
          }
        ],
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" },
                example: {
                  post_id: 1,
                  owner_id: 1,
                  description: "walking in Brighton!",
                  route: [
                    [-0.141176, 50.828873],
                    [-0.1422, 50.8293],
                    [-0.1431, 50.8302]
                  ],
                  location_name: "Brighton",
                  caption: "hi, this is a post about walking in Brighton!"
                }
              }
            }
          },
          "404": { description: "Not found" }
        }
      }
    },

    "/upload": {
      post: {
        summary: "Upload (test)",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StatusOk" },
                example: { status: "OK" }
              }
            }
          }
        }
      }
    },

    "/update": {
      put: {
        summary: "Update (test)",
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { type: "object", additionalProperties: true }
            }
          }
        },
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StatusOk" },
                example: { status: "OK" }
              }
            }
          }
        }
      }
    },

    "/delete": {
      delete: {
        summary: "Delete (test)",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/StatusOk" },
                example: { status: "OK" }
              }
            }
          }
        }
      }
    }
  },

  components: {
    schemas: {
      StatusOk: {
        type: "object",
        required: ["status"],
        properties: {
          status: { type: "string", example: "OK" }
        }
      },

      // Point as [lng, lat] (GeoJSON / PostGIS convention)
      Point: {
        type: "array",
        minItems: 2,
        maxItems: 2,
        items: [{ type: "number" }, { type: "number" }],
        example: [-0.141176, 50.828873]
      },

      // LineString coords: array of Points, min 2
      LineStringCoords: {
        type: "array",
        minItems: 2,
        items: { $ref: "#/components/schemas/Point" },
        example: [
          [-0.141176, 50.828873],
          [-0.1422, 50.8293],
          [-0.1431, 50.8302]
        ]
      },

      Post: {
        type: "object",
        required: [
          "post_id",
          "owner_id",
          "description",
          "route",
          "location_name",
          "caption"
        ],
        properties: {
          post_id: { type: "integer", example: 1 },
          owner_id: { type: "integer", example: 1 },
          description: { type: "string", example: "walking in Brighton!" },
          route: { $ref: "#/components/schemas/LineStringCoords" },
          location_name: { type: "string", example: "Brighton" },
          caption: {
            type: "string",
            example: "hi, this is a post about walking in Brighton!"
          }
        }
      }
    }
  }
} as const;
