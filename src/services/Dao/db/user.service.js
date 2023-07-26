import userModel from '../models/user.model.js';
import CartService from './cart.service.js';
import GetUserDTO from '../DTOs/getUserDTO.js';
import MailService from '../email.service.js';
import { dateValidator } from '../../../util.js';


class UserService {
    constructor(){
        this.cartService = new CartService();
        this.emailService = new MailService();
    }
    
    getAll = async () => {
        let users = await userModel.find();
        return users.map(user=> new GetUserDTO(user.toObject()));
    };
    getAllRaw = async () => {
        let users = await userModel.find();
        return users.map(user=> user.toObject());
    }
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
                if(cartId){await this.cartService.deleteCart(cartId);}
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
    clearUsers = async (username) => {
        try {
            const users = await this.getAllRaw();
            let usersToBeDeleted = []
            users.forEach(user => {
                if(dateValidator(user.last_connection,'h',48)){
                    usersToBeDeleted.push(user)
                }
            });
            const title = "Aviso de eliminación de cuenta"
            usersToBeDeleted.forEach(async (user) => {
                if(user.username !== username) {
                    await this.delete(user.username);
                    const message = `Hola ${user.name}!\nLe informamos que su cuenta a sido eliminada por inactividad.\nSepa disculpar las molestias.\nSaludos`
                    this.emailService.sendEmail(user.username, message, title, (error, result) => {
                        if(error){
                            throw {
                                error:  result.error, 
                                message: result.message
                            }
                        }
                    })
                }
            })
            return usersToBeDeleted;
        }
        catch(error) {
            throw error;
        }
    }
};
export default UserService;