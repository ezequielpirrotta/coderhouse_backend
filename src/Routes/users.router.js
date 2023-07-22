import { Router } from "express";
import { deleteUser, getUserByUsername, getUsers, saveUser, changeUserRol, saveDocuments, clearUsers} from "../controllers/users.controller.js";
import { passportCall, uploader } from "../util.js";

const router = Router();

router.get("/", getUsers);
router.post("/", saveUser);
router.post("/:uid/documents",passportCall("current"), uploader.fields([
                                { name: 'avatar', maxCount: 1 },
                                { name: 'product', maxCount: 1 }, 
                                { name: 'docs', maxCount: 3 }]), saveDocuments);
router.put("/premium/:uid", changeUserRol)
router.get("/:username", getUserByUsername);
router.delete("/:username", deleteUser);
router.delete("/", clearUsers)

export default router;
