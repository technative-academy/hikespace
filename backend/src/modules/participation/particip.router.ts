import express from "express";
import { ParticipController } from "./particip.controller.js";
import { ParticipRepository } from "./particip.repository.js";
import { ParticipService } from "./particip.service.js";

const router = express.Router();

const participRepo = new ParticipRepository();
const participService = new ParticipService(participRepo);
const participController = new ParticipController(participService);

router.post("/", participController.create);
router.delete("/:id", participController.delete);

export default router;
