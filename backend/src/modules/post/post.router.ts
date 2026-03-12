import express from "express";
import { PostController } from "./post.controller.js";
import { PostRepository } from "./post.repository.js";
import { PostService } from "./post.service.js";
import { requireAuth } from "#middleware/auth-middleware.js";

const router = express.Router();

const postRepo = new PostRepository();
const postService = new PostService(postRepo);
const postController = new PostController(postService);

router.post("/", requireAuth, postController.create);
router.get("/following", requireAuth, postController.getFromFollowing);
router.get("/by-user/:id", postController.getByUser);
router.get("/liked-by/:id", postController.likedByUser);
router.get("/", postController.getAll);
router.get("/:id", postController.get);
router.put("/:id", requireAuth, postController.update);
router.delete("/:id", requireAuth, postController.delete);

export default router;
