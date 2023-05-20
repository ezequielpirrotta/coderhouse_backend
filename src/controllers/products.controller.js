import ProductService from "../services/Dao/db/product.service.js";
import socketServer from "../app.js";
import CustomError from "../services/errors/CustomError.js";
import { generateProductErrorInfo } from "../services/errors/messages/product_creation_error.js";
import EErrors from "../services/errors/errors-enum.js";
import { log } from "../config/logger.js";

const productService = new ProductService();

export const getProducts = async (req, res, next) => {
    try { 
        let products = await productService.getProducts(req.query); 
        res.status(200).send(products);
    }
    catch(error) {
        req.logger.error(log(error.message,req))
        next(error)
    }
}
export const getProductById = async (req, res, next) => {
    try {
        let {pid} = req.params;
        let product = await productService.getProductById(pid);
        res.status(200).send(product);
    }
    catch(error) {
        req.logger.error(log(error.message,req))
        next(error)
    }
}
export const createProduct = async (req, res, next) => {
    let product = req.body;
    try {
        let available = product.stock > 0? true : false;
        product.is_available = available;
        if(!product.title || !product.price) {
            CustomError.createError({
                name: "Product Creation Error",
                cause: generateProductErrorInfo({title: product.title, price: product.price}),
                message: "Error tratando de crear el producto",
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        let resultProduct = await productService.create(product)
        if(!req.body.front) {
            socketServer.emit("event_product_created", {...resultProduct})
        }
        res.status(200).send({
            status: 'OK',
            message: "Product created succesfully. ",
            data: product
        });
    }
    catch(error) {
        req.logger.error(log(error.message,req))
        res.status(500).send(error);
    }
}
export const updateProduct = async (req, res, next) => {
    let {id} = req.params
    req.logger.debug(log("Llegué al update",req))
    try {
        let result = await productService.updateProduct(id, req.body)
        socketServer.emit("event_product_updated", result)
        res.status(200).send({
            status: 'OK',
            message: "Product updated succesfully.",
            data: result
        })
    }
    catch(error) {
        req.logger.error(log(error.message,req))
        next(error)
    }
}
export const deleteProduct = async (req, res, next) => {
    let {id} = req.params;
    try {
        await productService.deleteProduct(id)
        socketServer.emit("event_product_deleted", {id: id})
        res.status(200).send({
            status: 'OK',
            message: "Product deleted succesfully.",
            data: {id: id}
        })
    }
    catch(error) {
        req.logger.error(log(error.message,req))
        next(error)
    }
}