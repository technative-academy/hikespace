import { createDocument } from "zod-openapi";
import { z } from "zod";

import {
  CreateUserSchema,
  PublicUserSchema,
  UpdateUserSchema
} from "#modules/user/user.zod.js";

const StatusOkSchema = z
  .object({ status: z.string() })
  .meta({ id: "StatusOk", example: { status: "OK" } });

const LineStringGeoJSONSchema = z
  .object({
    type: z.literal("LineString"),
    coordinates: z.array(z.tuple([z.number(), z.number()])).min(2)
  })
  .meta({
    id: "LineStringGeoJSON",
    example: {
      type: "LineString",
      coordinates: [
        [-0.141176, 50.828873],
        [-0.1422, 50.8293],
        [-0.1431, 50.8302]
      ]
    }
  });

const PostSchema = z
  .object({
    id: z.number().int(),
    owner_id: z.number().int(),
    description: z.string(),
    route: LineStringGeoJSONSchema,
    location_name: z.string(),
    caption: z.string()
  })
  .meta({
    id: "Post",
    example: {
      id: 1,
      owner_id: 1,
      description: "Walking in Brighton!",
      route: {
        type: "LineString",
        coordinates: [
          [50.828873, -0.141176],
          [50.8293, -0.1422],
          [50.8302, -0.1431]
        ]
      },
      location_name: "Brighton",
      caption: "Hi, this is a post about walking in Brighton!"
    }
  });

const CreatePostSchema = z
  .object({
    description: z.string(),
    route: LineStringGeoJSONSchema,
    location_name: z.string(),
    caption: z.string()
  })
  .meta({
    id: "CreatePost",
    example: {
      description: "Walking in Brighton!",
      route: {
        type: "LineString",
        coordinates: [
          [50.828873, -0.141176],
          [50.8293, -0.1422],
          [50.8302, -0.1431]
        ]
      },
      location_name: "Brighton",
      caption: "Hi, this is a post about walking in Brighton!"
    }
  });

const UpdatePostSchema = CreatePostSchema.partial().meta({
  id: "UpdatePost",
  example: {
    description: "Updated walk around Brighton seafront",
    caption: "Updated caption"
  }
});

const IdPathParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .meta({ id: "IdPathParam", example: 1 });

const CreateUserOpenApiSchema = CreateUserSchema.meta({ id: "CreateUser" });
const PublicUserOpenApiSchema = PublicUserSchema.meta({ id: "PublicUser" });
const UpdateUserOpenApiSchema = UpdateUserSchema.meta({ id: "UpdateUser" });

const AnyJsonSchema = z
  .record(z.string(), z.any())
  .meta({ description: "Any JSON" });

const IdPathParams = z.object({ id: IdPathParamSchema });

const jsonResponse = (schema: z.ZodTypeAny, description = "OK") => ({
  description,
  content: {
    "application/json": {
      schema
    }
  }
});

const textResponse = (schema: z.ZodTypeAny, description = "OK") => ({
  description,
  content: {
    "text/plain": {
      schema
    }
  }
});

const corePaths = {
  "/": {
    get: {
      summary: "Hello endpoint",
      tags: ["Core"],
      responses: {
        "200": textResponse(z.string().meta({ example: "Hello from Express" }))
      }
    }
  }
};

const userPaths = {
  "/users": {
    post: {
      summary: "Create user",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: CreateUserOpenApiSchema
          }
        }
      },
      responses: {
        "201": jsonResponse(PublicUserOpenApiSchema, "Created"),
        "400": { description: "Bad request" },
        "500": { description: "Server error" }
      }
    }
  },

  "/users/{id}": {
    get: {
      summary: "Get user by id",
      tags: ["Users"],
      requestParams: {
        path: IdPathParams
      },
      responses: {
        "200": jsonResponse(PublicUserOpenApiSchema),
        "400": { description: "Bad request" },
        "404": { description: "Not found" }
      }
    },
    put: {
      summary: "Update user",
      tags: ["Users"],
      requestParams: {
        path: IdPathParams
      },
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: UpdateUserOpenApiSchema
          }
        }
      },
      responses: {
        "200": jsonResponse(PublicUserOpenApiSchema),
        "400": { description: "Bad request" },
        "404": { description: "Not found" },
        "500": { description: "Server error" }
      }
    },
    delete: {
      summary: "Delete user",
      tags: ["Users"],
      requestParams: {
        path: IdPathParams
      },
      responses: {
        "200": jsonResponse(StatusOkSchema),
        "400": { description: "Bad request" },
        "404": { description: "Not found" },
        "500": { description: "Server error" }
      }
    }
  }
};

const postPaths = {
  "/posts": {
    get: {
      summary: "Get all posts",
      tags: ["Posts"],
      responses: {
        "200": jsonResponse(z.array(PostSchema)),
        "500": { description: "Server error" }
      }
    },
    post: {
      summary: "Create post",
      tags: ["Posts"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: CreatePostSchema
          }
        }
      },
      responses: {
        "201": jsonResponse(PostSchema, "Created"),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "500": { description: "Server error" }
      }
    }
  },

  "/posts/{id}": {
    get: {
      summary: "Get post by id",
      tags: ["Posts"],
      requestParams: {
        path: IdPathParams
      },
      responses: {
        "200": jsonResponse(PostSchema),
        "400": { description: "Bad request" },
        "404": { description: "Not found" }
      }
    },
    put: {
      summary: "Update post",
      tags: ["Posts"],
      requestParams: {
        path: IdPathParams
      },
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: UpdatePostSchema
          }
        }
      },
      responses: {
        "200": jsonResponse(PostSchema),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "404": { description: "Not found" },
        "500": { description: "Server error" }
      }
    },
    delete: {
      summary: "Delete post",
      tags: ["Posts"],
      requestParams: {
        path: IdPathParams
      },
      responses: {
        "200": jsonResponse(StatusOkSchema),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "404": { description: "Not found" },
        "500": { description: "Server error" }
      }
    }
  }
};

export const openapiDocument = createDocument({
  openapi: "3.0.3",
  info: {
    title: "HikeSpace API",
    version: "1.0.0"
  },
  servers: [{ url: process.env.SWAGGER_URL ?? "http://localhost:3000" }],
  tags: [
    { name: "Core" },
    { name: "Users" },
    { name: "Posts" },
    { name: "Test" }
  ],

  paths: {
    ...corePaths,
    ...userPaths,
    ...postPaths
  },

  components: {
    schemas: {
      StatusOk: StatusOkSchema,
      LineStringGeoJSON: LineStringGeoJSONSchema,
      Post: PostSchema,
      CreatePost: CreatePostSchema,
      UpdatePost: UpdatePostSchema
    }
  }
});
