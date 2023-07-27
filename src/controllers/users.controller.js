import UserService from "../services/Dao/db/user.service.js";
import {log } from "../config/logger.js"

const userService = new UserService();

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getAll();

        res.send({status: 200, payload: users});
    }   
    catch(error) {
        res.status(error.code?error.code:500).send(error)
    }
}

export const getUserByUsername = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await userService.getUserByUsername(username);
        res.send({status: 200, payload: user});
    }   
    catch(error) {
        res.status(error.code?error.code:500).send(error)
    }
}
export const saveUser = async (req, res) => {
    try {
        const user = req.body;
        const result = await userService.saveUser(user);
        res.send({status: 200, payload: result});
    }   
    catch(error) {
        res.status(error.code?error.code:500).send(error)
    }
}
export const changeUserRol = async (req, res) => {
    try {
        const {uid} = req.params
        let user = {}
        
        let oldUser = await userService.getUserById(uid);
        if(oldUser.role === req.body.role){
            throw { 
                code: 409,
                detail: "No puedes cambiar a un rol que ya tienes"
            }
        }
        if(req.body.role==='premium'){

            const docs = {
                "identificacion": false,
                "domicilio": false,
                "cuenta": false,
            }
            for(let i = 0; i < oldUser.documents.length; i++){
                for(const doc in docs){
                    if((oldUser.documents[i].name).includes(doc)){
                        docs[doc] = true       
                    }
                }
            }
            let permission = false
            for(const doc in docs){
                permission = true;
                if(!docs[doc]){
                    permission = false;
                }
            }
            if(permission){
                oldUser.role = req.body.role
                user = oldUser;
                const result = await userService.updateUser({username: user.username},user);
                res.send({code: 201, message: "Usuario actualizado correctamente", payload: result}); 
            }
            else {
                throw { 
                    code: 409,
                    detail: "Falta documentación necesaria para cambiar de rol",
                    payload: {...docs}
                }
            }
        }
        else {
            oldUser.role = req.body.role
            user = oldUser;
            const result = await userService.updateUser({username: user.username},user);
            res.status(201).send({code: 201, message: "Usuario actualizado correctamente", payload: result});
        }
    }
    catch(error) {
        res.status(error.code?error.code:500).send(error)
    }
}
export const saveDocuments = async (req, res) => {
    try {
        const {uid} = req.params
        let user = {}
        if(uid) {
            user = await userService.getUserById(uid);
            const files = req.files
            let docsResult = [];
            for(const type of Object.keys(files)) {
                for(let i = 0; i < files[type].length; i++){
                    user.documents.push({name: files[type][i].originalname, reference: files[type][i].path})
                    docsResult.push({name: files[type][i].originalname, reference: files[type][i].path})
                }
            } 
            await userService.updateUser({username: user.username}, user);
            res.send({code: 201, message: "Usuario actualizado correctamente", payload: docsResult});
        }
    }
    catch(error) {
        res.status(error.code?error.code:500).send(error)
    }
}
export const deleteUser = async (req,res) => {
    try {
        const {username} = req.params;
        const user = await userService.delete(username);
        res.send({status: 200, payload: user});
    }
    catch(error) {
        res.status(error.code?error.code:500).send(error)
    }
}

export const clearUsers = async (req,res) => {
    try {
        const {username} = req.body;
        const result = await userService.clearUsers(username);
        res.send({status: 200, payload: result});
    }
    catch(error) {
        req.logger.error(log(error,req));
        res.status(error.code?error.code:500).send(error)
    }
}