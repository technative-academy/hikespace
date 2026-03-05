import express from "express";
import multer from "multer";
import { ImageController } from "./image.controller.js";
import { ImageRepository } from "./image.repository.js";
import { ImageService } from "./image.service.js";

const router = express.Router();
const upload = multer();

const imageRepo = new ImageRepository();
const imageService = new ImageService(imageRepo);
const imageController = new ImageController(imageService);

router.post("/", upload.array("images", 5), imageController.create);
router.get("/:id", imageController.get);
router.delete("/:id", imageController.delete);

export default router;
