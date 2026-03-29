import { Router } from "express";
import * as UserController from "../controller/userController";
const router = Router();

router.post("/login",  UserController.login);
router.post("/", UserController.register);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;