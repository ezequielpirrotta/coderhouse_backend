import  ticketModel  from "../models/ticket.model.js";
import mongoose from "mongoose";

class TicketService {
    
    getTickets = async () => {
        try {
            let tickets = await ticketModel.find();
            if(tickets.length > 0) {
                return tickets;
            }
            else {
                throw Error("Tickets not found.");
            }
        } catch (error) {
            throw {
                code: 404,
                message: 'Error getting tickets.',
                detail: error.message
            };
        }
    }
     
    getTicketById =  async (id) => {
        try {
            let ticket = await ticketModel.findById(id)
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
    createTicket = async (total, mail, code = "") => {
        try {
            let newTicket = {
                code: code, 
                purchase_datetime: new Date(), 
                amount: total,
                purchaser: mail
            } 
            ticket.code = toString(code);
            let ticket = await ticketModel.create(newTicket);
            if(ticket){ 
                return ticket;
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
                message: "Error creating new ticket",
                detail: error.message
            };
        }
       
    }
    
    resolveTicket = async (tid,order) => {

        try {
            
            let result = await ticketModel.updateOne({_id: tid}, {$set:order});
            if(result.modifiedCount > 0){
                let product = await this.getTicketById(pid);

                return {fieldUpdated: data.field, newValue: data.newValue, ...product._doc};
            }
            else {
                throw Error("El valor elegido es el mismo al que intenta cambiar, intente con uno diferente.")
            }
        }
        catch (error) {
            throw {
                code: error.code? error.code : 409,
                message: 'Error al agregar al carrito.',
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
                        throw Error("No se pudo borrar el carrito.")
                    }
                    else {
                        throw {
                            code: 404,
                            detail: "No se encontró el carrito!"
                        } 
                    }
                }
            }
            else {
                throw {
                    code: 400,
                    detail: "Valor id vacío"
                }
            }
        }
        catch (error) {
            throw {
                code: error.code,
                message: error.message? error.message : 'Error eliminando carrito',
                detail: error.detail? error.detail : error.message 
            }
        }
    }
}
export default TicketService
