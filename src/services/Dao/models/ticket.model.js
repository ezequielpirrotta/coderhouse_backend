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
    purchaser: String,
    paymentMethod: {
        type: String,
        enum: ['credit', 'debit', 'cash']
    },
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"       
                },
                quantity: {
                    type: Number,
                    default: 1
                }

            }   
        ]
    },
    status: {
        type: Boolean,
        default: false
    }
});
ticketSchema.pre('find', function() {
    this.populate('products.product');
})
ticketSchema.pre('findOne', function() {
    this.populate('products.product');
})
const ticketModel = mongoose.model(ticketsCollection, ticketSchema)
export default ticketModel;