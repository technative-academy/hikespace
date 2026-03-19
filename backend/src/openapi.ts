import { createDocument } from "zod-openapi";
import { z } from "zod";
import {
  CreatePostSchema as CreatePostModelSchema,
  PostPopulatedSchema,
  PostSchema as PostModelSchema,
  UpdatePostSchema as UpdatePostModelSchema
} from "#modules/post/post.zod.js";
import {
  ImageSchema as ImageModelSchema,
  uploadImageMetadataSchema
} from "#modules/image/image.zod.js";
import {
  createManyParticipSchema,
  createParticipSchema,
  participSchema
} from "#modules/participation/particip.zod.js";
import { likeSchema } from "#modules/like/like.zod.js";
import { followSchema } from "#modules/following/follow.zod.js";
import { MeUserSchema } from "#modules/user/user.zod.js";
import { PublicUserSchema } from "#modules/user/user.base.zod.js";

const StatusOkSchema = z
  .object({ status: z.string() })
  .meta({ id: "StatusOk", example: { status: "OK" } });

const MessageOkSchema = z
  .object({ message: z.literal("OK") })
  .meta({ id: "MessageOk", example: { message: "OK" } });

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

const PostSchema = PostModelSchema.meta({
  id: "Post",
  example: {
    id: 1,
    owner_id: "user_123abc",
    description: "Walking in Brighton!",
    route: {
      type: "LineString",
      coordinates: [
        [-0.141176, 50.828873],
        [-0.1422, 50.8293],
        [-0.1431, 50.8302]
      ]
    },
    location_name: "Brighton",
    caption: "Hi, this is a post about walking in Brighton!"
  }
});

const PopulatedPostSchema = PostPopulatedSchema.meta({
  id: "PopulatedPost",
  example: {
    id: 1,
    owner_id: "user_123abc",
    description: "Walking in Brighton!",
    route: {
      type: "LineString",
      coordinates: [
        [-0.141176, 50.828873],
        [-0.1422, 50.8293],
        [-0.1431, 50.8302]
      ]
    },
    location_name: "Brighton",
    caption: "Hi, this is a post about walking in Brighton!",
    likes: 3,
    images: [
      {
        id: 1,
        post_id: 1,
        image_url: "1738757200123-trail.jpg",
        position: 0
      }
    ],
    participations: [
      {
        id: "user_456def",
        name: "Alex Walker",
        image: "https://signed-url.example.com/avatar.jpg"
      }
    ],
    like_id: 14
  }
});

const CreatePostSchema = CreatePostModelSchema.meta({
  id: "CreatePost",
  example: {
    description: "Walking in Brighton!",
    route: {
      type: "LineString",
      coordinates: [
        [-0.141176, 50.828873],
        [-0.1422, 50.8293],
        [-0.1431, 50.8302]
      ]
    },
    location_name: "Brighton",
    caption: "Hi, this is a post about walking in Brighton!"
  }
});

const UpdatePostSchema = UpdatePostModelSchema.meta({
  id: "UpdatePost",
  example: {
    description: "Updated walk around Brighton seafront",
    caption: "Updated caption"
  }
});

const ImageSchema = ImageModelSchema.meta({
  id: "Image",
  example: {
    id: 1,
    post_id: 10,
    image_url: "1738757200123-trail.jpg",
    position: 0
  }
});

const UploadImageMetadataSchema = uploadImageMetadataSchema.meta({
  id: "UploadImageMetadata",
  example: {
    post_id: 10,
    metadata: [{ position: 0 }, { position: 1 }]
  }
});

const ParticipationSchema = participSchema.meta({
  id: "Participation",
  example: {
    id: 1,
    user_id: "user_123abc",
    post_id: 10
  }
});

const CreateParticipationSchema = createParticipSchema.meta({
  id: "CreateParticipation",
  example: {
    user_id: "user_123abc",
    post_id: 10
  }
});

const CreateManyParticipationSchema = createManyParticipSchema.meta({
  id: "CreateManyParticipation",
  example: {
    userIds: ["user_123abc", "user_456def"],
    postId: 10
  }
});

const LikeSchema = likeSchema.meta({
  id: "Like",
  example: {
    id: 1,
    post_id: 10,
    user_id: "user_123abc"
  }
});

const FollowSchema = followSchema.meta({
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
    posts: [],
    likes: [],
    particips: [],
    followers: [],
    followings: []
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
        "200": jsonResponse(MessageOkSchema),
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
      description: "Better Auth sign-in endpoint served by this API.",
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
        "200": jsonResponse(z.array(PopulatedPostSchema)),
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
  "/posts/following": {
    get: {
      summary: "Get posts from followed users",
      tags: ["Posts"],
      security: AuthSecurity,
      responses: {
        "200": jsonResponse(z.array(PopulatedPostSchema)),
        "401": { description: "Unauthorized" },
        "500": { description: "Server error" }
      }
    }
  },
  "/posts/by-user/{id}": {
    get: {
      summary: "Get posts by user id",
      tags: ["Posts"],
      requestParams: {
        path: UserIdPathParams
      },
      responses: {
        "200": jsonResponse(z.array(PopulatedPostSchema)),
        "400": { description: "Bad request" },
        "404": { description: "User not found" },
        "500": { description: "Server error" }
      }
    }
  },
  "/posts/liked-by/{id}": {
    get: {
      summary: "Get posts liked by user id",
      tags: ["Posts"],
      requestParams: {
        path: UserIdPathParams
      },
      responses: {
        "200": jsonResponse(z.array(PopulatedPostSchema)),
        "400": { description: "Bad request" },
        "404": { description: "User not found" },
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
        "200": jsonResponse(PopulatedPostSchema),
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
        "404": { description: "Image not found" },
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
        "200": jsonResponse(MessageOkSchema),
        "400": { description: "Bad request" },
        "404": { description: "Image not found" },
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
        "200": jsonResponse(MessageOkSchema),
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
        "200": jsonResponse(MessageOkSchema),
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
        "200": jsonResponse(MessageOkSchema),
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
      MessageOk: MessageOkSchema,
      LineStringGeoJSON: LineStringGeoJSONSchema,
      Post: PostSchema,
      PopulatedPost: PopulatedPostSchema,
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
