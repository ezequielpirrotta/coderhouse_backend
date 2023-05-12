import ProductService from "../services/Dao/db/product.service.js";
import socketServer from "../app.js";

const productService = new ProductService();

export const getProducts = async (req, res, next) => {
    try { 
        let products = await productService.getProducts(req.query); 
        res.status(200).send(products);
    }
    catch(error) {
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
        next(error)
    }
}
export const createProduct = async (req, res, next) => {
    let product = req.body;
    try {
        let available = stock > 0? true : false;
        product.is_available = available;
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
        next(error);
    }
}
export const updateProduct = async (req, res, next) => {
    let {id} = req.params
    
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
        next(error)
    }
}