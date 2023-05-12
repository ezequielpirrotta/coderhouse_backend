import CartService from '../services/Dao/db/cart.service.js'
import config from '../config/config.js';


const cartService = new CartService();

export const getCarts = async (req, res, next) => {
    try {
        let carts = await cartService.getCarts();
        res.send(carts);
    }
    catch(error) {
        next(error)
    }
}
export const getCartById = async (req, res, next) => {
    try {
        let {cid} = req.params;
        let cart = await cartService.getCartById(cid);
        res.send(cart);
    }
    catch(error) {
        next(error)
    }
}
export const createCart = async (req, res, next) => {
    let products = req.body.products;
    
    try {
        let result = await cartService.addCart(products)
        res.cookie('cartCookie',JSON.stringify(result), {maxAge: 24*60*60*1000})
        res.send(result);
    }
    catch(error) {

        next(error)
    }
}
export const replaceCart = async (req, res, next) => {
    let cart_id = req.params.cid; 
        let {products} = req.body;
        try {
            let result = await cartService.replaceCart(cart_id, products);
            res.status(200).send(result)
        } 
        catch(error) {
            next(error)
        }
}
export const updateProductFromCart = async (req, res, next) => {
    let cart_id = req.params.cid;
    let product_id = req.params.pid;
    let {quantity} = req.body;
    try {
        let result = await cartService.updateProduct(cart_id, product_id, quantity);
        res.status(200).send(result)
    } 
    catch(error) {
        next(error)
    }
}
export const addProductToCart = async (req, res, next) => {
    let cart_id = req.params.cid; 
    let {quantity,product_id} = req.body;
    try {
        let result = await cartService.updateProduct(cart_id, product_id, quantity, true);
        res.status(200).send(result)
    } 
    catch(error) {
        next(error)
    }
}

export const purchaseCart = async (req, res, next) => { 
    try {
        const {cid} = req.params;
        const {username} = req.body
        let cart = await cartService.getCartById(cid)
        
        let data = {
            username: username,
            products: cart.products,
        }
        let requestData = {
            method:"POST",
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        let request = new Request(config.endpoint+config.port+'/api/tickets/', requestData) 
        let result = await fetch(request)
        .then( (response) => response.json());
        
        res.status(200).send(result);
    }
    catch(error) {
        next(error)
    }
}
export const deleteProductFromCart = async (req, res, next) => { 
    try {
        let {cid, pid} = req.params
        let result = await cartService.deleteProductFromCart(cid, pid)
            
        res.status(200).send({
            status: 'OK',
            message: "Product deleted from cart succesfully.",
            data: {id: cid, result: result}
        })
    }
    catch(error) {
        next(error)
    }
}
export const deleteProducts = async (req, res, next) => { 
    try {
        let {cid} = req.params;
        let result = await cartService.deleteProductFromCart(cid,null,true);
        res.status(200).send({
            status: 'OK',
            message: "Cart deleted succesfully.",
            data: {cid: cid, result: result}
        })
    }
    catch(error) {
        next(error)
    }
}

export const deleteCart = async (req, res, next) => { 
    try {
        let {cid} = req.body;
        let result = await cartService.deleteCart(cid);
        res.status(200).send({
            status: 'OK',
            message: "Cart deleted succesfully.",
            data: {id: cid, result: result}
        })
    }
    catch(error) {
        next(error)
    }
}
