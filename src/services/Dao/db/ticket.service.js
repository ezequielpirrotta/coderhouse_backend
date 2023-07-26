import GetTicketDTO from "../DTOs/getTicketDTO.js";
import ticketModel  from "../models/ticket.model.js";
import UserService from "./user.service.js";
import mongoose from "mongoose";
import moment from "moment";
import ProductService from "./product.service.js";

const userService = new UserService();
const productService =  new ProductService

class TicketService {
    
    getAll = async () => {
        try {
            let tickets = await ticketModel.find();
            tickets = tickets.map(ticket=> new GetTicketDTO(ticket.toObject()));

            if(tickets.length > 0) {
                return tickets;
            }
            else {
                throw Error("Tickets not found.");
            }
        } catch (error) {
            throw {
                code: 404,
                error: 'Error getting tickets.',
                message: error.message
            };
        }
    }
    getTicketsByUsername = async (username) => {
        try { 
            let tickets = await ticketModel.find({purchaser: username})
            tickets = tickets.map(ticket=> new GetTicketDTO(ticket.toObject()));
            if(tickets) {
                return tickets;
            }
            else {
                throw Error("Tickets not found.");
            }
        } catch (error) {
            throw {
                code: 404,
                error: 'Error getting tickets.',
                message: error.message
            };
        }
    }
    getTicketById = async (id) => {
        try {
            let ticket = await ticketModel.findById(id)
            ticket = new GetTicketDTO(ticket);
            if(ticket) {
                return ticket;
            }
            else {
                throw Error("Ticket not found");
            }
        }
        catch (error) {
            throw {
                code: 404,
                message: `Error getting ticket with ID: ${id}.`,
                detail: error.message
            };
        }
    }
    createTicket = async (username, products, paymentMethod) => {
        try {
            const resultUser = await userService.getUserByUsername(username);
            const resultProducts = await productService.getProducts({limit:999})
            let actualProducts = resultProducts.payload.map(product=> {
                let result = false;
                products.forEach(element => {
                    if(product._id.equals(new mongoose.Types.ObjectId(element.product))){
                        result = {product: product, quantity: element.quantity};
                    }
                });
                if(result) return result;
            })
            actualProducts = actualProducts.filter(product=>product!==undefined)
            let sum = actualProducts.reduce((acc,prev)=>{
                acc += prev.product.price * prev.quantity 
                return acc;
            },0)
            let ticketNumber = Date.now() + Math.floor(Math.random()*10000+1)
            
            let ticket = {
                code: ticketNumber,
                purchaser: username,
                purchase_datetime: moment().format(),
                products: actualProducts.map((product)=>{return {product: new mongoose.Types.ObjectId(product.product._id),quantity: product.quantity}}),
                amount: sum,
                status: false,
                paymentMethod: paymentMethod
            }
            let ticketResult = await ticketModel.create(ticket);
            resultUser.orders.push(ticketResult._id)
            await userService.updateUser({username: username}, resultUser)

            if(ticketResult){ 
                return ticketResult;
            }
            else {
                throw {
                    code: 404,
                    message: "Couldn't find the created ticket."
                }
            }
        } catch (error) {
            throw {
                code: error.code? error.code : 400,
                message: error.message?error.message:"Error creating new ticket",
                detail: error.message
            };
        }
       
    }
    
    resolveTicket = async (tid) => {

        try {
            let ticket = await ticketModel.findById(tid);
            ticket.status=true;
            ticket.purchase_datetime = moment(ticket.purchase_datetime);
            let result = await ticketModel.updateOne({_id: tid}, {$set:ticket});
            if(result.modifiedCount > 0){
                let ticket = await this.getTicketById(tid);
                return ticket;
            }
            else {
                throw Error("No se pudo resolver el ticket.")
            }
        }
        catch (error) {
            throw {
                code: error.code? error.code : 409,
                message: 'Error al comprar el pedido.',
                detail: error.message
            } 
        }
    }
    deleteTicket = async (id) => {
        try {
            if(id) {
                let result = await ticketModel.deleteOne({_id: id});
                if(result.deletedCount > 0) {
                    return true;
                }
                else {
                    let cart = await this.getTicketById(id)
                    if(cart) {
                        throw Error("No se pudo borrar el ticket.")
                    }
                    else {
                        throw {
                            code: 404,
                            message: "No se encontró el ticket!"
                        } 
                    }
                }
            }
            else {
                throw {
                    code: 400,
                    message: "Valor id vacío"
                }
            }
        }
        catch (error) {
            throw {
                code: error.code?error.code:500,
                message: 'Error eliminando ticket',
                detail: error.detail? error.detail : error.message 
            }
        }
    }
}
export default TicketService
