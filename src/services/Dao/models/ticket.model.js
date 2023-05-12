import mongoose from "mongoose";

const ticketsCollection = "tickets"

const stringSchemaIndexedNonUniqueRequired = {
    type: String,
    require: true,
    index: true
}
const stringSchemaUniqueRequired = {
    type: String,
    unique: true,
    require: true
}
const ticketSchema = new mongoose.Schema({
    code: stringSchemaUniqueRequired,
    purchase_datetime: Date,
    amount: Number,
    purchaser: stringSchemaUniqueRequired,
    products: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"       
            }   
        ]
    }
});

const ticketModel = mongoose.model(ticketsCollection, ticketSchema)
export default ticketModel;