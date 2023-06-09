import { Router } from "express";
import { getTickets, createTicket, getTicketById } from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", getTickets);
router.get("/:tid", getTicketById)
router.post("/", createTicket);

export default router;
