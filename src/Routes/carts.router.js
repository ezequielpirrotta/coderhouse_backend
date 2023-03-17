import { Router } from "express";
import DBCartManager from "../Dao/MongoManagers/DBCartManager.js";
import DBProductManager from "../Dao/MongoManagers/DBProductManager.js";

const dbCrt = new DBCartManager;
const dbPm = new DBProductManager;
const router = Router()

router.get('/', async (req, res, next) => {
    try {
        let id = parseInt(req.params.cid);
        let cart = await dbCrt.getCarts(id);
        res.send(cart);
    }
    catch(error) {
        next(error)
    }
})

router.get('/:cid', async (req, res, next) => {
    try {
        let id = req.params.cid;
        let cart = await dbCrt.getCartById(id);
        res.send(cart);
    }
    catch(e) {
        res.status(e.code? e.code : 500).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        }); 
    }
})

router.post('/', async (req, res, next) => {
    let products = req.body.products;
    try {
        let result = await dbCrt.addCart(products)
        res.send(result);
    }
    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        }); 
    }
})

router.put('/:cid/product/:pid', async (req, res, next) => {
    let cart_id = req.params.cid; 
    let product_id = req.params.pid;
    let {quantity} = req.body;
    try {
        
        let result = await dbCrt.addToCart(cart_id, product_id, quantity);
        res.status(200).send(result)
    } 
    catch(error) {
        next(error)
    }
})

router.delete('/:cid', async (req, res, next) => {
    try {
        let id = req.params.cid;
        let result = await dbCrt.deleteCart(id);
        res.status(200).send({
            status: 'OK',
            message: "Carrito eliminado correctamente",
            data: {id: id, result: result}
        })
    }
    catch(error) {
        next(error)
    }
})

export default router