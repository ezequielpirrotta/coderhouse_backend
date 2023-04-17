import { Router } from "express";
import DBProductManager from "../Dao/MongoManagers/DBProductManager.js";
import socketServer from "../app.js";

const dbPm = new DBProductManager();
const router = Router()

router.get('/', async (req, res, next) => {
    try { 
        let products = await dbPm.getProducts(req.query); 
        res.status(200).send(products);
    }
    catch(error) {
        next(error)
    }
})

router.get('/:pid', async (req, res, next) => {
    try {
        let {pid} = req.params;
        let product = await dbPm.getProductById(pid);
        res.status(200).send(product);
    }
    catch(error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    let product = req.body;
    
    try {
        product = await dbPm.addProduct(product.title, product.description, product.price, product.code, product.stock, product.category, product.thumbnail)
        if(!req.body.front) {
            socketServer.emit("event_product_created", {...product})
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
})

router.put('/:id', async (req, res, next) => {
    let {id} = req.params
    
    try {
        let result = await dbPm.updateProduct(id, req.body)
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
})

router.delete('/:id', async (req, res, next) => {
    let {id} = req.params;
    try {
        await dbPm.deleteProduct(id)
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
})

export default router