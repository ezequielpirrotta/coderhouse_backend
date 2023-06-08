import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productsCollection = "products"

const stringSchemaUniqueRequired = {
    type: String,
    unique: true,
    require: true
}
const stringSchemaNonUniqueRequired = {
    type: String,
    require: true
}

const productSchema = new mongoose.Schema({
    title: stringSchemaNonUniqueRequired,
    description: stringSchemaNonUniqueRequired,
    price: Number,
    code: stringSchemaUniqueRequired,
    available: Boolean,
    stock: Number,
    category: {
        type: String,
        enum: ["ropa", "comida", "otros"],
        default: "comida",
        require: true,
        index: true
    },
    thumbnail: stringSchemaNonUniqueRequired,
    owner: {
        ...stringSchemaNonUniqueRequired,
        default: "admin"
    }
});
productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productsCollection, productSchema)
export default productModel;