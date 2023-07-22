import TicketService from "../services/Dao/db/ticket.service.js";
import UserService from "../services/Dao/db/user.service.js";

const ticketService = new TicketService();
const userService =  new UserService();

export const getTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getAll();
        res.status(200).send({payload: tickets});
    }   
    catch(error) {
        res.status(error.code).send(error)
    }
}

export const getTicketById = async (req, res, next) => {
    try {
        const {tid} = req.params;
        const ticket = await ticketService.getTicketById(tid);
        res.send({status: 200, payload: ticket});
    }   
    catch(error) {
        res.status(error.code).send(error)
    }
}
export const getTicketsByUsername = async (req, res, next) => {
    try {
        const {username} = req.params;
        const tickets =  await ticketService.getTicketsByUsername(username)
        res.send({status: 200, payload: tickets});
    }   
    catch(error) {
        res.status(error.code?error.code:500).send(error)
    }
}
export const createTicket = async (req, res, next) => {
    try {
        const {username,products,paymentMethod} = req.body;
        const ticketResult = await ticketService.createTicket(username,products,paymentMethod)
        const result = await ticketService.getTicketById(ticketResult.id)
        res.send({status: 200, payload: ticketResult});
    }   
    catch(error) {
        next(error)
    }
}
export const resolveTicket = async (req, res, next) => {
    try {        
        await ticketService.resolveTicket(req.params.tid);
        res.send({status: 200, result: "Order solved"});
    }
    catch(error) {
        res.status(error.code?error.code:500).send(error)
    }
}
export const deleteTicket = async (req, res, next) => {
    try {
        const {id} = req.params;
        const ticket = await ticketService.getTicketById(id)
        let user = await userService.getUserByUsername(ticket.purchaser);
        user.orders = user.orders.filter(order =>!(order.equals(id)) )
        await ticketService.deleteTicket(id);
        await userService.updateUser({username: user.username},user)
        res.send({status: 200, payload: "Deleted succesfully"});
    }
    catch(error) {
        res.status(error.code?error.code:500).send(error)
    }
}
