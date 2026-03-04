import express from "express";
import { PostController } from "./post.controller.js";
import { PostRepository } from "./post.repository.js";
import { PostService } from "./post.service.js";

const router = express.Router();

const postRepo = new PostRepository();
const postService = new PostService(postRepo);
const postController = new PostController(postService);

router.post("/", postController.create);
router.get("/:id", postController.get);
router.get("/", postController.getAll);

export default router;
