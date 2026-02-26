import { createDocument } from "zod-openapi";
import { z } from "zod";

import { CreateUserSchema, PublicUserSchema } from "#modules/user/user.zod.js";

const StatusOkSchema = z
  .object({ status: z.string() })
  .meta({ id: "StatusOk", example: { status: "OK" } });

const PointSchema = z
  .tuple([z.number(), z.number()])
  .meta({ id: "Point", example: [-0.141176, 50.828873] });

const LineStringCoordsSchema = z
  .array(PointSchema)
  .min(2)
  .meta({
    id: "LineStringCoords",
    example: [
      [-0.141176, 50.828873],
      [-0.1422, 50.8293],
      [-0.1431, 50.8302]
    ]
  });

const PostSchema = z
  .object({
    id: z.number().int(),
    owner_id: z.number().int(),
    description: z.string(),
    route: LineStringCoordsSchema,
    location_name: z.string(),
    caption: z.string()
  })
  .meta({
    id: "Post",
    example: {
      id: 1,
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
  });

const CreatePostSchema = z
  .object({
    description: z.string(),
    route: LineStringCoordsSchema,
    location_name: z.string(),
    caption: z.string()
  })
  .meta({
    id: "CreatePost",
    example: {
      description: "walking in Brighton!",
      route: [
        [-0.141176, 50.828873],
        [-0.1422, 50.8293],
        [-0.1431, 50.8302]
      ],
      location_name: "Brighton",
      caption: "hi, this is a post about walking in Brighton!"
    }
  });

const IdPathParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .meta({ id: "IdPathParam", example: 1 });

const CreateUserOpenApiSchema = CreateUserSchema.meta({ id: "CreateUser" });
const PublicUserOpenApiSchema = PublicUserSchema.meta({ id: "PublicUser" });

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
    }
  }
};

const postPaths = {
  "/posts": {
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
    }
  }
};

const testPaths = {
  "/upload": {
    post: {
      summary: "Upload (test)",
      tags: ["Test"],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: AnyJsonSchema
          }
        }
      },
      responses: {
        "200": jsonResponse(StatusOkSchema)
      }
    }
  },

  "/update": {
    put: {
      summary: "Update (test)",
      tags: ["Test"],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: AnyJsonSchema
          }
        }
      },
      responses: {
        "200": jsonResponse(StatusOkSchema)
      }
    }
  },

  "/delete": {
    delete: {
      summary: "Delete (test)",
      tags: ["Test"],
      responses: {
        "200": jsonResponse(StatusOkSchema)
      }
    }
  }
};

export const openapiDocument = createDocument({
  openapi: "3.0.3",
  info: {
    title: "Test Express API",
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
    ...postPaths,
    ...testPaths
  },

  components: {
    schemas: {
      StatusOk: StatusOkSchema,
      Point: PointSchema,
      LineStringCoords: LineStringCoordsSchema,
      Post: PostSchema,
      CreatePost: CreatePostSchema
    }
  }
});
