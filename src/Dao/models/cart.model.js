import mongoose from "mongoose";

const cartsCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        type: Array,
        default: [{
            pid: {
                type: String,
                require: [true, "El id de producto es requerido."]
            },
            quantity: Number
        }],
        require: [true, "El carrito es requerido."]
    },
})

export const cartModel = mongoose.model(cartsCollection, cartSchema)