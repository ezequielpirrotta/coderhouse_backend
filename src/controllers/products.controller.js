import ProductService from "../services/Dao/db/product.service.js";
import CustomError from "../services/errors/CustomError.js";
import { generateProductErrorInfo } from "../services/errors/messages/product_creation_error.js";
import EErrors from "../services/errors/errors-enum.js";
import { log } from "../config/logger.js";
import { generarCadenaAlfanumerica } from "../util.js";

const productService = new ProductService();

export const getProducts = async (req, res, next) => {
    try {
        let products = await productService.getProducts(req.query); 
        res.status(200).send(products);
    }
    catch(error) {
        req.logger.error(log(error.message,req))
        res.status(error.code?error.code:500).send(error);
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
        res.status(error.code?error.code:500).send(error);
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
        if(req.user.role === "premium"){
            product.owner = req.user.email;
        }
        product.code = generarCadenaAlfanumerica(6);
        let resultProduct = await productService.create(product)
        res.status(201).send({
            status: 'OK',
            message: "Product created succesfully. ",
            data: resultProduct
        });
    }
    catch(error) {
        req.logger.error(log(error.message,req))
        res.status(error.code?error.code:500).send(error);
    }
}
export const updateProduct = async (req, res, next) => {
    let {id} = req.params
    req.logger.debug(log("Llegué al update",req))
    try {
        let result = await productService.updateProduct(id, req.body)
        res.status(200).send({
            status: 'OK',
            message: "Product updated succesfully.",
            data: result
        })
    }
    catch(error) {
        req.logger.error(log(error.message+', '+error.detail,req))
        res.status(error.code?error.code:500).send(error);
    }
}
export const deleteProduct = async (req, res, next) => {
    let {id} = req.params;
    try {
        let result = await productService.deleteProduct(id)
        if(result) {
            if(req.user.role === "premium"){
                const message = `Hola ${req.user.name}!\nLe informamos que su producto con id: "${id}" a sido eliminado con éxito!\nSaludos!`
                this.emailService.sendEmail(user.username, message, title, (error, result) => {
                    if(error){
                        throw {
                            error:  result.error, 
                            message: result.message
                        }
                    }
                })
            }
        }
        res.status(200).send({
            status: 'OK',
            message: "Product deleted succesfully.",
            data: {id: id}
        })
    }
    catch(error) {
        req.logger.error(log(error.message,req))
        res.status(error.code?error.code:500).send(error);
    }
}