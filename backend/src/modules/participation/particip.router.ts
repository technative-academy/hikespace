import express from "express";
import { ParticipController } from "./particip.controller.js";
import { ParticipRepository } from "./particip.repository.js";
import { ParticipService } from "./particip.service.js";
import { requireAuth } from "#middleware/auth-middleware.js";
import { PostRepository } from "#modules/post/post.repository.js";

const router = express.Router();

const participRepo = new ParticipRepository();
const postRepo = new PostRepository();
const participService = new ParticipService(participRepo, postRepo);
const participController = new ParticipController(participService);

router.post("/", requireAuth, participController.create);
router.post("/many", requireAuth, participController.createMany);
router.delete("/:id", requireAuth, participController.delete);

export default router;
