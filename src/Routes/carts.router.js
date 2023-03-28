import { Router } from "express";
import DBCartManager from "../Dao/MongoManagers/DBCartManager.js";

const dbCrt = new DBCartManager;
const router = Router()

router.get('/', async (req, res, next) => {
    try {
        let carts = await dbCrt.getCarts();
        res.send(carts);
    }
    catch(error) {
        next(error)
    }
})

router.get('/:cid', async (req, res, next) => {
    try {
        let {cid} = req.params;
        let cart = await dbCrt.getCartById(cid);
        res.send(cart);
    }
    catch(error) {
        next(error)
    }
})

router.post('/', async (req, res, next) => {
    let products = req.body.products;
    try {
        let result = await dbCrt.addCart(products)
        res.send(result);
    }
    catch(error) {
        next(error)
    }
})
router.put('/:cid', async (req, res, next) => {
    let cart_id = req.params.cid; 
    let {products} = req.body;
    try {
        let result = await dbCrt.replaceCart(cart_id, products);
        res.status(200).send(result)
    } 
    catch(error) {
        next(error)
    }
})
router.put('/:cid/product/:pid', async (req, res, next) => {
    let cart_id = req.params.cid;
    let product_id = req.params.pid;
    let {quantity} = req.body;
    try {
        let result = await dbCrt.updateProduct(cart_id, product_id, quantity);
        res.status(200).send(result)
    } 
    catch(error) {
        next(error)
    }
})
router.put('/:cid/product', async (req, res, next) => {
    let cart_id = req.params.cid; 
    let {quantity,product_id} = req.body;
    try {
        let result = await dbCrt.updateProduct(cart_id, product_id, quantity, true);
        res.status(200).send(result)
    } 
    catch(error) {
        next(error)
    }
})
router.delete('/:cid/products/:pid', async (req, res, next) => {
    try {
        let {cid, pid} = req.params
        let result = await dbCrt.deleteProductFromCart(cid, pid)
            
        res.status(200).send({
            status: 'OK',
            message: "Product deleted from cart succesfully.",
            data: {id: cid, result: result}
        })
    }
    catch(error) {
        next(error)
    }
})
router.delete('/:cid', async (req, res, next) => {
    try {
        let {cid} = req.params;
        let result = await dbCrt.deleteProductFromCart(cid,null,true);
        res.status(200).send({
            status: 'OK',
            message: "Cart deleted succesfully.",
            data: {cid: cid, result: result}
        })
    }
    catch(error) {
        next(error)
    }
})
router.delete('/', async (req, res, next) => {
    try {
        let {cid} = req.body;
        let result = await dbCrt.deleteCart(cid);
        res.status(200).send({
            status: 'OK',
            message: "Cart deleted succesfully.",
            data: {id: cid, result: result}
        })
    }
    catch(error) {
        next(error)
    }
})

export default router