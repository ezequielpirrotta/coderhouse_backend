import { cartModel } from "../models/cart.model.js";
import ProductService from "./product.service.js";
import mongoose from "mongoose";
const dbPm = new ProductService();
class CartService {
    
    getCarts = async (limit) => {
        try {
            let carts = limit? await cartModel.find().limit({limit}) : await cartModel.find();
            if(carts.length > 0) {
                return carts;
            }
            else {
                throw Error("Carts not found.");
            }
        } catch (error) {
            throw {
                code: 404,
                message: 'Error getting carts.',
                detail: error.message
            };
        }
    }
     
    getCartById =  async (id) => {
        try {
            let cart = await cartModel.findById(id)
            if(cart) {
                return cart;
            }
            else {
                throw Error("Cart not found");
            }
        }
        catch (error) {
            throw {
                code: 404,
                message: `Error getting Cart with ID: ${id}.`,
                detail: error.message
            };
        }
    }
    addCart = async (products) => {
        let newCart = {wasPurchased: false};
        try {
            let cart = await cartModel.create(newCart);
            if(cart){ 
                for (const key in products) {
                    let newProduct = products[key].quantity? {product: products[key].id, quantity: products[key].quantity}:{product: products[key].id};
                    cart.products.push(newProduct);
                }
                let result = await cart.updateOne(cart);
                
                return await this.getCartById(cart._id);
            }
            else {
                throw {
                    code: 404,
                    message: "Couldn't find the created cart."
                }
            }
        } catch (error) {
            throw {
                code: error.code? error.code : 400,
                message: "Error creating new cart",
                detail: error.message
            };
        }
       
    }
    replaceCart = async (cid, products) => {
        let productsList = products? products : null;
        try {
            if(!cid || !productsList) {
                throw {
                    code: 400,
                    message: 'Missing parameters cid or products'
                }
            }

            let cart = await this.getCartById(cid)
            if(cart.products.length === 0 && productsList.length === 0){
                throw {
                    code: 404,
                    message: "Couldn't update, the cart is already empty!"
                }
            }
            cart.products = []
            for (const key in productsList) {
                let newProduct = productsList[key].quantity? {product: productsList[key].id, quantity: productsList[key].quantity}:{product: productsList[key].id};
                cart.products.push(newProduct); 
            }
            
            let result = await cart.updateOne(cart);
            if(result.modifiedCount > 0) {
                let cart = await this.getCartById(cid);
                if(cart.products.length === 0) {
                    cart.products = [];
                    await cart.updateOne(cart);
                    cart = await this.getCartById(cid);
                }  
                return cart;
            }
            else {
                throw {
                    code: 404,
                    message: "Couldn't update the cart."
                }
            }
        } catch (error) {
            throw {
                code: error.code? error.code : 400,
                message: "Error replacing cart",
                detail: error.message
            };
        }
    }
    updateProduct = async (cid, pid, quantity, newPdt = false) => {

        try {
            if(cid === undefined || pid === undefined) {
                throw {
                    code: 400,
                    message: 'Missing parameters cid or pid'
                }
            }
            
            if(await dbPm.getProductById(pid)) {
                let newProduct = {product: pid, quantity: quantity}
                let cart = await this.getCartById(cid)
                if(newPdt) {
                    cart.products.push(newProduct);
                }
                else {
                    pid = new mongoose.Types.ObjectId(pid)
                    cart.products.find(element => element.product._id.equals(pid)).quantity = quantity;
                }
                let result = await cart.updateOne(cart);
                if(result) {
                    return await this.getCartById(cid);
                }
                else {
                    throw Error("El valor elegido es el mismo al que intenta cambiar, intente con uno diferente.")
                } 
            }
        }
        catch (error) {
            throw {
                code: error.code? error.code : 409,
                message: 'Error al agregar al carrito.',
                detail: error.message
            } 
        }
    }
    deleteProductFromCart = async (cid, pid=null, all=false) => {
        try {
            if(cid||pid) {
                let newProductsList = [];
                if(!all&&pid) {
                    pid = new mongoose.Types.ObjectId(pid)
                    newProductsList = (await this.getCartById(cid)).products.filter(element => !element.product.equals(pid));
                }
                let result = await this.replaceCart(cid, newProductsList);
                if(result) {
                    return true;
                }
                else {
                    let cart = await this.getCartById(cid)
                    if(cart) {
                        if(cart.products.length > 0) {
                            throw Error("No se pudo borrar el carrito.")
                        } 
                    }
                    else {
                        throw {
                            code: 404,
                            detail: "No se encontró el carrito!"
                        } 
                    }
                }
            }
            else {
                throw {
                    code: 400,
                    detail: "Valor id vacío"
                }
            }
        }
        catch (error) {
            throw {
                code: error.code,
                message: error.message? error.message : 'Error eliminando carrito',
                detail: error.detail? error.detail : error.message 
            }
        }
    }
    deleteAllProductsFromCart = async (id) => {
        try {
            if(id) {
                let newProductsList = [];
                let result = await this.replaceCart(cid, newProductsList);
                if(result) {
                    return true;
                }
                else {
                    let cart = await this.getCartById(cid)
                    if(cart) {
                        if(cart.products.length > 0) {

                            throw Error("No se pudo borrar el carrito.")
                        } 
                    }
                    else {
                        throw {
                            code: 404,
                            detail: "No se encontró el carrito!"
                        } 
                    }
                }
            }
            else {
                throw {
                    code: 400,
                    detail: "Valor id vacío"
                }
            }
        }
        catch (error) {
            throw {
                code: error.code,
                message: error.message? error.message : 'Error eliminando carrito',
                detail: error.detail? error.detail : error.message 
            }
        }
    }
    deleteCart = async (id) => {
        try {
            if(id) {
                let result = await cartModel.deleteOne({_id: id});
                if(result.deletedCount > 0) {
                    return true;
                }
                else {
                    let cart = await this.getCartById(id)
                    if(cart) {
                        throw Error("No se pudo borrar el carrito.")
                    }
                    else {
                        throw {
                            code: 404,
                            detail: "No se encontró el carrito!"
                        } 
                    }
                }
            }
            else {
                throw {
                    code: 400,
                    detail: "Valor id vacío"
                }
            }
        }
        catch (error) {
            throw {
                code: error.code,
                message: error.message? error.message : 'Error eliminando carrito',
                detail: error.detail? error.detail : error.message 
            }
        }
    }
}
export default CartService
