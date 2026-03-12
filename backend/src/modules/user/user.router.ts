import express from "express";
import multer from "multer";
import { UserController } from "./user.controller.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";
import { requireAuth } from "#middleware/auth-middleware.js";
import { checkAuth } from "#middleware/check-auth-midddleware.js";

const router = express.Router();
const upload = multer();

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

router.get("/me", requireAuth, userController.getMe);
router.get("/:id", checkAuth, userController.getById);
router.get("/", checkAuth, userController.getAll);
router.put(
  "/avatar",
  requireAuth,
  upload.single("profile_picture"),
  userController.updateImage
);
router.delete("/", requireAuth, userController.delete);

export default router;
