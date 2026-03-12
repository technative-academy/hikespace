import { createDocument } from "zod-openapi";
import { z } from "zod";
import { MeUserSchema } from "#modules/user/user.zod.js";
import { PublicUserSchema } from "#modules/user/user.base.zod.js";

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

const ImageSchema = z
  .object({
    id: z.number().int(),
    post_id: z.number().int(),
    image_url: z.string(),
    position: z.number().int()
  })
  .meta({
    id: "Image",
    example: {
      id: 1,
      post_id: 10,
      image_url: "1738757200123-trail.jpg",
      position: 0
    }
  });

const UploadImageMetadataSchema = z
  .array(
    z.object({
      position: z.number().int()
    })
  )
  .meta({
    id: "UploadImageMetadata",
    example: [{ position: 0 }, { position: 1 }]
  });

const ParticipationSchema = z
  .object({
    id: z.number().int(),
    user_id: z.string(),
    post_id: z.number().int()
  })
  .meta({
    id: "Participation",
    example: {
      id: 1,
      user_id: "user_123abc",
      post_id: 10
    }
  });

const CreateParticipationSchema = z
  .object({
    user_id: z.string(),
    post_id: z.number().int()
  })
  .meta({
    id: "CreateParticipation",
    example: {
      user_id: "user_123abc",
      post_id: 10
    }
  });

const CreateManyParticipationSchema = z
  .object({
    userIds: z.array(z.string()).min(1),
    postId: z.number().int()
  })
  .meta({
    id: "CreateManyParticipation",
    example: {
      userIds: ["user_123abc", "user_456def"],
      postId: 10
    }
  });

const LikeSchema = z
  .object({
    id: z.number().int(),
    post_id: z.number().int(),
    user_id: z.string()
  })
  .meta({
    id: "Like",
    example: {
      id: 1,
      post_id: 10,
      user_id: "user_123abc"
    }
  });

const FollowSchema = z
  .object({
    follower_id: z.string(),
    following_id: z.string(),
    created_at: z.string().datetime()
  })
  .meta({
    id: "Follow",
    example: {
      follower_id: "user_current",
      following_id: "user_123abc",
      created_at: "2026-03-06T12:00:00.000Z"
    }
  });

const IdPathParamSchema = z.coerce
  .number()
  .int()
  .positive()
  .meta({ id: "IdPathParam", example: 1 });

const UserIdPathParamSchema = z
  .string()
  .min(1)
  .meta({ id: "UserIdPathParam", example: "user_123abc" });

const PublicUserOpenApiSchema = PublicUserSchema.meta({ id: "PublicUser" });
const MeUserOpenApiSchema = MeUserSchema.meta({
  id: "MeUser",
  example: {
    id: "user_123abc",
    name: "Jane Doe",
    email: "jane@example.com",
    image: "https://signed-url.example.com/avatar.jpg",
    followersCount: 12,
    followingCount: 7,
    posts: []
  }
});

const AnyJsonSchema = z
  .record(z.string(), z.any())
  .meta({ description: "Any JSON" });
const SignInEmailRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
    rememberMe: z.boolean().optional()
  })
  .meta({
    id: "SignInEmailRequest",
    example: {
      email: "jane@example.com",
      password: "your-password",
      rememberMe: true
    }
  });

const IdPathParams = z.object({ id: IdPathParamSchema });
const UserIdPathParams = z.object({ id: UserIdPathParamSchema });
const AuthSecurity: Array<Record<string, string[]>> = [{ cookieAuth: [] }];

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
    get: {
      summary: "Get all users",
      tags: ["Users"],
      responses: {
        "200": jsonResponse(z.array(PublicUserOpenApiSchema)),
        "500": { description: "Server error" }
      }
    },
    delete: {
      summary: "Delete user account",
      tags: ["Users"],
      security: AuthSecurity,
      responses: {
        "200": jsonResponse(StatusOkSchema),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "500": { description: "Server error" }
      }
    }
  },
  "/users/avatar": {
    put: {
      summary: "Update user profile image",
      tags: ["Users"],
      security: AuthSecurity,
      requestBody: {
        required: false,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                profile_picture: {
                  type: "string",
                  format: "binary"
                }
              }
            } as any
          }
        }
      },
      responses: {
        "200": jsonResponse(
          z.object({ message: z.string() }).meta({ id: "UserMessageOk" })
        ),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "500": { description: "Server error" }
      }
    }
  },
  "/users/me": {
    get: {
      summary: "Get current user profile",
      tags: ["Users"],
      security: AuthSecurity,
      responses: {
        "200": jsonResponse(MeUserOpenApiSchema),
        "401": { description: "Unauthorized" },
        "404": { description: "Not found" }
      }
    }
  },
  "/users/{id}": {
    get: {
      summary: "Get user by id",
      tags: ["Users"],
      requestParams: {
        path: UserIdPathParams
      },
      responses: {
        "200": jsonResponse(PublicUserOpenApiSchema),
        "400": { description: "Bad request" },
        "404": { description: "Not found" }
      }
    }
  }
};

const authPaths = {
  "/api/auth/sign-in/email": {
    post: {
      summary: "Sign in with email and password",
      description:
        "Better Auth sign-in endpoint served by this API at http://localhost:3000/api/auth/sign-in/email",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: SignInEmailRequestSchema
          }
        }
      },
      responses: {
        "200": jsonResponse(AnyJsonSchema),
        "400": { description: "Bad request" },
        "401": { description: "Invalid credentials" }
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
      security: AuthSecurity,
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
      security: AuthSecurity,
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
      security: AuthSecurity,
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

const imagePaths = {
  "/images": {
    post: {
      summary: "Upload images",
      tags: ["Images"],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["post_id", "metadata", "images"],
              properties: {
                post_id: {
                  type: "integer",
                  format: "int32",
                  description: "Post id for the uploaded images"
                },
                metadata: {
                  type: "string",
                  description:
                    'JSON stringified array of image metadata (e.g. [{"position":0}])'
                },
                images: {
                  type: "array",
                  items: { type: "string", format: "binary" },
                  maxItems: 5
                }
              }
            } as any
          }
        }
      },
      responses: {
        "201": jsonResponse(z.array(ImageSchema), "Created"),
        "400": { description: "Bad request" },
        "404": { description: "Post not found" },
        "500": { description: "Server error" }
      }
    }
  },
  "/images/{id}": {
    get: {
      summary: "Get image by id",
      tags: ["Images"],
      requestParams: {
        path: IdPathParams
      },
      responses: {
        "200": jsonResponse(ImageSchema),
        "400": { description: "Bad request" },
        "500": { description: "Server error" }
      }
    },
    delete: {
      summary: "Delete image",
      tags: ["Images"],
      requestParams: {
        path: IdPathParams
      },
      responses: {
        "200": jsonResponse(
          z.object({ message: z.string() }).meta({ id: "MessageOk" })
        ),
        "400": { description: "Bad request" },
        "500": { description: "Server error" }
      }
    }
  }
};

const participationPaths = {
  "/participations": {
    post: {
      summary: "Create participation",
      tags: ["Participations"],
      security: AuthSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: CreateParticipationSchema
          }
        }
      },
      responses: {
        "201": jsonResponse(ParticipationSchema, "Created"),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "500": { description: "Server error" }
      }
    }
  },
  "/participations/many": {
    post: {
      summary: "Create many participations",
      tags: ["Participations"],
      security: AuthSecurity,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: CreateManyParticipationSchema
          }
        }
      },
      responses: {
        "201": jsonResponse(z.array(ParticipationSchema), "Created"),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "403": { description: "Forbidden" },
        "500": { description: "Server error" }
      }
    }
  },
  "/participations/{id}": {
    delete: {
      summary: "Delete participation",
      tags: ["Participations"],
      security: AuthSecurity,
      requestParams: {
        path: IdPathParams
      },
      responses: {
        "200": jsonResponse(
          z
            .object({ message: z.string() })
            .meta({ id: "ParticipationMessageOk" })
        ),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "500": { description: "Server error" }
      }
    }
  }
};

const likePaths = {
  "/likes/{id}": {
    post: {
      summary: "Create like",
      tags: ["Likes"],
      security: AuthSecurity,
      requestParams: {
        path: IdPathParams
      },
      responses: {
        "201": jsonResponse(LikeSchema, "Created"),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "404": { description: "User or post not found" },
        "500": { description: "Server error" }
      }
    },
    delete: {
      summary: "Delete like",
      tags: ["Likes"],
      security: AuthSecurity,
      requestParams: {
        path: IdPathParams
      },
      responses: {
        "200": jsonResponse(
          z.object({ message: z.string() }).meta({ id: "LikeMessageOk" })
        ),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "404": { description: "Like not found" },
        "500": { description: "Server error" }
      }
    }
  }
};

const followPaths = {
  "/follows/{id}": {
    post: {
      summary: "Follow user",
      tags: ["Follows"],
      security: AuthSecurity,
      requestParams: {
        path: UserIdPathParams
      },
      responses: {
        "201": jsonResponse(FollowSchema, "Created"),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "404": { description: "Following ID not found" },
        "500": { description: "Server error" }
      }
    },
    delete: {
      summary: "Unfollow user",
      tags: ["Follows"],
      security: AuthSecurity,
      requestParams: {
        path: UserIdPathParams
      },
      responses: {
        "200": jsonResponse(
          z.object({ message: z.string() }).meta({ id: "FollowMessageOk" })
        ),
        "400": { description: "Bad request" },
        "401": { description: "Unauthorized" },
        "500": { description: "Server error" }
      }
    }
  }
};

export const openapiDocument = createDocument({
  openapi: "3.1.1",
  info: {
    title: "HikeSpace API",
    version: "1.0.0"
  },
  servers: [{ url: process.env.SWAGGER_URL ?? "http://localhost:3000" }],
  tags: [
    { name: "Core" },
    { name: "Auth" },
    { name: "Users" },
    { name: "Posts" },
    { name: "Images" },
    { name: "Participations" },
    { name: "Likes" },
    { name: "Follows" },
    { name: "Test" }
  ],

  paths: {
    ...corePaths,
    ...authPaths,
    ...userPaths,
    ...postPaths,
    ...imagePaths,
    ...participationPaths,
    ...likePaths,
    ...followPaths
  },

  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "better-auth.session_token",
        description: "Better Auth session cookie"
      }
    },
    schemas: {
      StatusOk: StatusOkSchema,
      LineStringGeoJSON: LineStringGeoJSONSchema,
      Post: PostSchema,
      CreatePost: CreatePostSchema,
      UpdatePost: UpdatePostSchema,
      PublicUser: PublicUserOpenApiSchema,
      MeUser: MeUserOpenApiSchema,
      Image: ImageSchema,
      UploadImageMetadata: UploadImageMetadataSchema,
      Participation: ParticipationSchema,
      CreateParticipation: CreateParticipationSchema,
      CreateManyParticipation: CreateManyParticipationSchema,
      Like: LikeSchema,
      Follow: FollowSchema
    }
  }
});
