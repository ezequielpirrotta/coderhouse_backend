import { Router } from "express";
import { deleteUser, getUserByUsername, getUsers, saveUser} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", saveUser);
router.get("/:username", getUserByUsername);
router.delete("/:username", deleteUser);

export default router;
