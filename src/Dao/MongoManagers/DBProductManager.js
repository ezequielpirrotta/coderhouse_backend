import { productModel } from "../models/product.model.js";
import Product from "../models/Product.js";
class DBProductManager {
    
    getProducts = async (limit) => {
        try {
            let products = limit? await productModel.find().limit({limit}) : await productModel.find();
            if(products.length > 0) {
                return products;
            }
            else {
                throw Error("Products not found.");
            }
        } catch (error) {
            throw {
                code: 404,
                message: 'Error getting products.',
                detail: e.message
            };
        }
    }
     
    getProductById = async (id) => {
        try {
            let product = await productModel.findById(id)
            if(product) {
                return product;
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
    addProduct = async (title, description, price, code, stock, category, thumbnail) => {
        let status = true;
        let newProduct = new Product(title, description, price, code, status, stock, category, thumbnail);
        try {
            let result = await productModel.create(newProduct);
            if(result) {
                return {_id: result._id, ...newProduct};
            }
            else {
                throw Error("No se encuentra el producto creado.");
            }
        } catch (error) {
            throw {
                message: `Error creando producto nuevo: ${newProduct.title}`,
                detail: `Detalle del error: ${error.message}`,
                data: newProduct
            };
        }
       
    }
    updateProduct = async (pid, data) => {
        try {
            let productUpdated = {}
            productUpdated[data.field] = data.newValue;
            let result = await productModel.updateOne({_id: pid}, {...productUpdated});
            if(result.modifiedCount > 0){
                let product = await this.getProductById(pid);
                return {fieldUpdated: data.field, newValue: data.newValue, ...product._doc};
            }
            else {
                throw Error("El valor elegido es el mismo al que intenta cambiar, intente con uno diferente.")
            } 
                
        }
        catch (error) {
            throw {
                code: 409,
                message: "Error actualizando producto.",
                detail: error.message,
                data: {id: pid, ...data}
            } 
        }
    }
    deleteProduct = async (id) => {
        try {
            if(id) {
                let result = await productModel.deleteOne({_id: id});
                if(result.deletedCount > 0) {
                    return true;
                }
                else {
                    let product = await this.getProductById(id)
                    if(product) {
                        throw Error("No se pudo borrar el producto.")
                    }
                    else {
                        throw {
                            code: 404,
                            detail: "No se encontró el producto!"
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
                message: 'Error eliminando producto',
                detail: error.detail? error.detail : error.message 
            }
        }
    }
}
export default DBProductManager
