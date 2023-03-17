import mongoose from "mongoose";

const productsCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: {
        type: String,
        unique: true,
        require: [true, "El código es requerido."]
    },
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: String
})

export const productModel = mongoose.model(productsCollection, productSchema)