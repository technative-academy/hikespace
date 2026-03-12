import type { Request, Response } from "express";
import type { PostService } from "./post.service.js";
import {
  CreatePostSchema,
  PostPopulatedSchema,
  PostSchema,
  UpdatePostSchema
} from "./post.zod.js";
import { IdParamSchema } from "#utils/validators.js";

export class PostController {
  constructor(private readonly postService: PostService) {}

  // POST /upload
  create = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const parsedBody = CreatePostSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error.flatten()
      });
    }

    try {
      const post = await this.postService.create({
        ...parsedBody.data,
        owner_id: req.user.id
      });

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

    try {
      const post = await this.postService.get(
        parsedParams.data.id,
        req.user.id
      );

      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      return res.status(200).json(PostPopulatedSchema.parse(post));
    } catch (error) {
      return res.status(500).json({
        message: "Invalid id parameter",
        error
      });
    }
  };

  // GET /posts/
  getAll = async (_req: Request, res: Response) => {
    try {
      const posts = await this.postService.getAll();

      return res.status(200).json(PostPopulatedSchema.array().parse(posts));
    } catch (error) {
      return res.status(500).json({
        message: "Invalid id parameter",
        error
      });
    }
  };

  getFromFollowing = async (req: Request, res: Response) => {
    try {
      const posts = await this.postService.getFromFollowing(req.user.id);

      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({
        message: "Error getting following posts",
        error
      });
    }
  };

  // PUT /posts/:id
  update = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const parsedParams = IdParamSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return res.status(400).json({
        message: "Invalid id parameter",
        errors: parsedParams.error.flatten()
      });
    }

    const parsedBody = UpdatePostSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: parsedBody.error.flatten()
      });
    }

    try {
      const post = await this.postService.update(
        parsedParams.data.id,
        parsedBody.data
      );

      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      return res.status(200).json(PostSchema.parse(post));
    } catch (error) {
      return res.status(500).json({
        message: "Failed to update post",
        error: error
      });
    }
  };

  // DELETE /posts/:id
  delete = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const parsedParams = IdParamSchema.safeParse(req.params);

    if (!parsedParams.success) {
      return res.status(400).json({
        message: "Invalid id parameter",
        errors: parsedParams.error.flatten()
      });
    }

    const post = await this.postService.get(parsedParams.data.id, req.user.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    try {
      await this.postService.delete(parsedParams.data.id);

      return res.status(200).json({ status: "OK" });
    } catch (error) {
      return res.status(500).json({
        message: "Failed to delete post"
      });
    }
  };
}
