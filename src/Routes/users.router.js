import { Router } from "express";
import { deleteUser, getUserByUsername, getUsers, saveUser, updateUser} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", saveUser);
router.put("/:username", updateUser)
router.put("/premium/:uid", updateUser)
router.get("/:username", getUserByUsername);
router.delete("/:username", deleteUser);

export default router;
