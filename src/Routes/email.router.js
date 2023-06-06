import { Router } from "express";
import {sendEmail, sendEmailWithAttachments} from '../controllers/email.controller.js';

const router = Router();

router.post("/", sendEmail);
router.post("/attachments", sendEmailWithAttachments);

export default router;