import type { Request, Response } from "express";
import type { PostService } from "./post.service.js";
import { CreatePostSchema, PostSchema } from "./post.zod.js";
import { IdParamSchema } from "#utils/validators.js";

export class PostController {
  constructor(private readonly postService: PostService) {}

  // POST /upload
  create = async (req: Request, res: Response) => {
    const parsedBody = CreatePostSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error.flatten()
      });
    }

    try {
      const post = await this.postService.create(parsedBody.data);

      return res.status(201).json(PostSchema.parse(post));
    } catch (error) {
      return res.status(500).json({
        message: "Failed to create post"
      });
    }
  };

  // GET /posts/:id
  get = async (req: Request, res: Response) => {
    const parsedParams = IdParamSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return res.status(400).json({
        message: "Invalid id parameter",
        errors: parsedParams.error.flatten()
      });
    }

    const post = await this.postService.get(parsedParams.data.id);

    if (!post) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json(PostSchema.parse(post));
  };
}
