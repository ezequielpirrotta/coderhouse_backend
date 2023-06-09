import UserService from "../services/Dao/db/user.service.js";

const userService = new UserService();

export const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAll();
        res.send({status: 200, payload: users});
    }   
    catch(error) {
        next(error)
    }
}

export const getUserByUsername = async (req, res, next) => {
    try {
        const {username} = req.params;
        const user = await userService.getUserByUsername(username);
        res.send({status: 200, payload: user});
    }   
    catch(error) {
        next(error)
    }
}
export const saveUser = async (req, res, next) => {
    try {
        const user = req.body;
        const result = await userService.saveUser(user);
        res.send({status: 200, payload: result});
    }   
    catch(error) {
        next(error)
    }
}
export const updateUser = async (req, res, next) => {
    try {
        const {username,uid} = req.params
        let user = {}
        if(uid) {
            let oldUser = await userService.getUserById(uid);
            oldUser.role = req.body.role
            user = oldUser;
            console.log(oldUser)

        }
        else {
            user = req.body;
        }
        const result = await userService.updateUser(
            {username: username? username : user.username}, user);
        res.send({code: 201, message: "Usuario actualizado correctamente", payload: result});
    }
    catch(error) {
        console.log(error)
        res.status(error.code).send(error)
    }
}
export const deleteUser = async (req,res,next) => {
    try {
        const {username} = req.params;
        const user = await userService.delete(username);
        res.send({status: 200, payload: user});
    }
    catch(error) {
        next(error)
    }
}