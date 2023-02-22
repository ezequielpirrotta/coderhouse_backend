import { Router } from "express";
import CartManager from "../Managers/CartManager.js";
import ProductManager from "../Managers/ProductManager.js";

const cm = new CartManager("./files/carts.json");
const pm = new ProductManager("./files/products.json");
const router = Router()

router.post('/', async (req, res) => {
    let products = req.body.products;
    try {
        await cm.addCart(products)
        res.send(products);
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

router.get('/:cid', async (req, res) => {
    try {
        let id = parseInt(req.params.cid);
        let cart = await cm.getCartById(id);
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

router.post('/:cid/product/:pid', async (req, res) => {
    let cart_id = parseInt(req.params.cid); 
    let product_id = parseInt(req.params.pid);
    try {
        if(cart_id === undefined || product_id === undefined) {
            throw {
                code: 400,
                message: 'Error al agregar al carrito',
                detail: `Detalle del error: faltan alguno de los parámetros cid o pid`
            }
        }
        let result = await cm.addToCart(cart_id, product_id);
        res.status(200).send(result)
    } 
    catch(e) {
        res.status(e.code).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})
router.delete('/:cid', async (req, res) => {
    try {
        let id = parseInt(req.params.cid);
        let cart = await cm.deleteCart(id);
        res.status(200).send({
            status: 'OK',
            message: "Carrito eliminado correctamente",
            data: {id: id, cart: cart}
        })
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

export default router