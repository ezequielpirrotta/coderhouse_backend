import { Router } from "express";
import { getTickets, createTicket, getTicketById } from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", getTickets);
router.post("/", createTicket);
router.get("/:tid", getTicketById)

export default router;
