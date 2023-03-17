import { cartModel } from "../models/cart.model.js";
import DBProductManager from "./DBProductManager.js";
const dbPm = new DBProductManager;
class DBCartManager {
    
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
     
    getCartById = async (id) => {
        try {
            let cart = await cartModel.findById(id)
            if(cart) {
                return cart;
            }
            else {
                throw Error("Product not found");
            }
        }
        catch (error) {
            throw {
                code: 404,
                message: `Error getting product with ID: ${id}.`,
                detail: error.message
            };
        }
    }
    addCart = async (products) => {
        let newCart = {products: products};
        try {
            let result = await cartModel.create(newCart);
            if(result) {
                return {id: result._id, ...newCart};
            }
            else {
                throw {
                    code: 404,
                    message: "No se encuentra el carrito creado."
                }
            }
        } catch (error) {
            throw {
                code: error.code? error.code : 400,
                message: "Error creando carrito nuevo",
                detail: `Detalle del error: ${error.message}`
            };
        }
       
    }
    addToCart = async (cid, pid, quantity) => {

        try {
            if(cid === undefined || pid === undefined) {
                throw {
                    code: 400,
                    message: `Detalle del error: faltan alguno de los parámetros cid o pid`
                }
            }
            
            if(await dbPm.getProductById(pid)) {
                let newProduct = {pid: pid, quantity: quantity}
                let cart = await this.getCartById(cid);
                cart.products.push(newProduct);
                let result = await cart.save();
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
export default DBCartManager
