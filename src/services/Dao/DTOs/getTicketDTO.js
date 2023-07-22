import moment from "moment"

export default class GetTicketDTO {
    constructor(ticket) {
        this.id = ticket._id,
        this.code = ticket.code,
        this.amount = ticket.amount,
        this.purchase_datetime = ticket.purchase_datetime?moment(ticket.purchase_datetime).format('DD-MM-yy, HH:mm:ss'):null , 
        this.purchaser = ticket.purchaser,
        this.products = ticket.products,
        this.status = ticket.status,
        this.paymentMethod = ticket.paymentMethod
    }
}