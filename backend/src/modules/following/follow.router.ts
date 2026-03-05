import express from "express";
import { FollowController } from "./follow.controller.js";
import { FollowRepository } from "./follow.repository.js";
import { FollowService } from "./follow.service.js";

const router = express.Router();

const followRepo = new FollowRepository();
const followService = new FollowService(followRepo);
const followController = new FollowController(followService);

router.post("/", followController.create);
router.delete("/:id", followController.delete);

export default router;
