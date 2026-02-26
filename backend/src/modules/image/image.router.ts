import express from "express";
import { ImageController } from "./image.controller.js";
import { ImageRepository } from "./image.repository.js";
import { ImageService } from "./image.service.js";

const router = express.Router();

const imageRepo = new ImageRepository();
const imageService = new ImageService(imageRepo);
const imageController = new ImageController(imageService);

// todo: figure out how to route images - possibly through post creation/updates?

export default router;
