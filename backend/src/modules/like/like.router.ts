import express from "express";
import { LikeController } from "./like.controller.js";
import { LikeRepository } from "./like.repository.js";
import { LikeService } from "./like.service.js";

const router = express.Router();

const likeRepo = new LikeRepository();
const likeService = new LikeService(likeRepo);
const likeController = new LikeController(likeService);

router.post("/", likeController.create);
router.delete("/:id", likeController.delete);

export default router;
