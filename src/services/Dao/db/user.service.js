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
        const result = await userModel.findOne({username: username});
        return result;
    };
    updateUser = async (filter, value) => {
        let result = await userModel.updateOne(filter, value);
        return result;
    }
};
export default UserService;