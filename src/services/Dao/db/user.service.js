import userModel from '../models/user.model.js';
import CartService from './cart.service.js';

const cartService = new CartService();
class UserService {
    
    getAll = async () => {
        let users = await userModel.find();
        return users.map(user=>user.toObject());
    };
    saveUser = async (user) => {
        try {
            if(!user.username || !user.password){
                return {error:"Campos 'username' y 'password' obligatorios"}
            }
            let result = await userModel.create(user);
            return result;
        }
        catch(error){
            return {error: error.message}
        }
    };
    getUserByUsername = async (username) => {
        const result = await userModel.findOne({username});
        return result;
    };
    getUserById = async (id) => {
        const result = await userModel.findOne({_id: id});
        return result;  
    }
    updateUser = async (filter, value) => {
        try {
            let result = await userModel.updateOne(filter, value);
            if(result.modifiedCount > 0) {
                return result;
            }
            else {
                throw {
                    code: 401,
                    detail: "No se pudo actualizar el usuario"
                }
            }
        }
        catch(error) {
            throw error;
        }
    }
    delete = async (username) => {
        if(username) {
            let cartId = (await this.getUserByUsername(username)).cart;
            let result = await userModel.deleteOne({username: username});
            if(result.deletedCount > 0) {
                if(cartId){await cartService.deleteCart(cartId);}
                return true;
            }
            else {
                let cart = await this.getUserByUsername(username)
                if(cart) {
                    throw Error("No se pudo borrar el usuario.")
                }
                else {
                    throw {
                        code: 404,
                        detail: "No se encontró el usuario!"
                    } 
                }
            }
        }
    }
};
export default UserService;