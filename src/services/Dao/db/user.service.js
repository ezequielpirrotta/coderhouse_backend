import userModel from '../models/user.model.js';

class UserService {
    
    getAll = async () => {
        let users = await userModel.find();
        return users.map(user=>user.toObject());
    };
    saveUser = async (user) => {
        let result = await userModel.create(user);
        return result;
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
        let result = await userModel.updateOne(filter, value);
        return result;
    }
    delete = async (username) => {
        if(username) {
            let result = await userModel.deleteOne({username: username});
            if(result.deletedCount > 0) {
                return true;
            }
            else {
                let cart = await this.getUserByUsername(username)
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
    }
};
export default UserService;