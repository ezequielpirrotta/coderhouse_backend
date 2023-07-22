import { Router } from "express";
import { getTickets, createTicket, getTicketById, getTicketsByUsername, resolveTicket, deleteTicket } from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", getTickets);
router.get("/:tid", getTicketById)
router.get("/:username/orders", getTicketsByUsername)
router.post("/", createTicket);
router.get("/:tid/resolve", resolveTicket)
router.delete("/:id", deleteTicket)

export default router;
