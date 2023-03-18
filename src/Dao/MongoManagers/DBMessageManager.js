import { messageModel } from "../models/message.model.js";
class DBProductManager {
    
    getMessages = async () => {
        try {
            let msgs = await messageModel.find();
            if(msgs.length > 0) {
                return msgs;
            }
            else {
                throw Error("Messages not found.");
            }
        } catch (error) {
            throw {
                code: 404,
                message: 'Error getting messages.',
                detail: e.message
            };
        }
    }
     
    getMessageById = async (id) => {
        try {
            let message = await messageModel.findById(id)
            if(message) {
                return message;
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
    addMessage = async (message, user) => {
        
        let newMessage = {message: message, user: user};
        try {
            let result = await messageModel.create(newProduct);
            if(result) {
                return {_id: result._id, ...newMessage};
            }
            else {
                throw Error("No se encuentra el usuario creado.");
            }
        } catch (error) {
            throw {
                message: `Error creando message nuevo para el usuario: ${newMessage.user}`,
                detail: `Detalle del error: ${error.message}`,
                data: newMessage
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