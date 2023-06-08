import { Router } from "express";
import {sendEmail, sendEmailWithAttachments, sendResetPasswordEmail} from '../controllers/email.controller.js';

const router = Router();

router.post("/", sendEmail);
router.post("/resetPass", sendResetPasswordEmail);
router.post("/attachments", sendEmailWithAttachments);

export default router;