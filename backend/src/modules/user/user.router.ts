import express from "express";
import multer from "multer";
import { UserController } from "./user.controller.js";
import { UserRepository } from "./user.repository.js";
import { UserService } from "./user.service.js";

const router = express.Router();
const upload = multer();

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);

// router.post("/", userController.create);
// router.get("/:id", userController.get);
// router.get("/", userController.getAll);
// router.put("/:id", upload.single("profile_picture"), userController.update);
// router.delete("/:id", userController.delete);

export default router;
