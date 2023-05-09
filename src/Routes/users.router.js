import { Router } from "express";
import { getUserByUsername, getUsers, saveUser} from "../Controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", saveUser);
router.get("/:username", getUserByUsername)

export default router;
