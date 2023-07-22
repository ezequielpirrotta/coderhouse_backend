import {generateProduct} from '../../util.js'
import { log } from '../../config/logger.js';
import ProductService from '../../services/Dao/db/product.service.js';

const productService = new ProductService()

export const getProducts = async (req, res) => {
    try {
        let products = [];
        for (let i = 0; i < 50; i++) {
            products.push(generateProduct());
        }
        res.send({status: "success", payload: products});
    } catch (error) {
        req.logger.error(log(error.message,req));
        res.status(500).send({error:  error, message: "No se pudo obtener los productos:"});
    }
};
export const createProducts = async (req, res) => {
    try {
        const {amount} = req.body  
        let products = [];
        for (let i = 0; i < amount; i++) {
            const product = generateProduct()
            const result = await productService.create(product)  
            products.push(product);
        }
        res.send({status: "success", payload: products});
    } catch (error) {
        req.logger.error(log(error.message,req));
        res.status(500).send({error:  error, message: "No se pudo obtener los productos:"});
    }
};