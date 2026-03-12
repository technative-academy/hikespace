import express from "express";
import { PostController } from "./post.controller.js";
import { PostRepository } from "./post.repository.js";
import { PostService } from "./post.service.js";
import { requireAuth } from "#middleware/auth-middleware.js";
import { checkAuth } from "#middleware/check-auth-midddleware.js";

const router = express.Router();

const postRepo = new PostRepository();
const postService = new PostService(postRepo);
const postController = new PostController(postService);

router.post("/", requireAuth, postController.create);
router.get("/:id", checkAuth, postController.get);
router.get("/", postController.getAll);
router.get("/following", requireAuth, postController.getFromFollowing);
router.put("/:id", requireAuth, postController.update);
router.delete("/:id", requireAuth, postController.delete);

export default router;
