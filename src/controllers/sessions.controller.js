import { log } from '../config/logger.js';
import { createHash, isValidPassword, generateJWToken } from '../util.js';
import config from '../config/config.js';
import UserService from '../services/Dao/db/user.service.js';

const userService = new UserService()
export const login = async (req, res)=>{
    let user = req.user.user;
    let cart = req.user.cart?req.user.cart:null;
    req.logger.debug(log("Llegué al login",req))
    user = {
        name : `${user.first_name} ${user.last_name}`,
        email: user.username,
        age: user.age,
        role: user.role
    }  
    const access_token = generateJWToken(user,'24h');
    if(cart){
        cart = JSON.stringify(cart)
        res.cookie("cartCookie", cart, {
            maxAge: 24*60*60*1000
        })
    }
    res.cookie('commerceCookieToken', access_token, {
        maxAge: 24*60*60*1000,
        httpOnly: true
    }).send({status:"success", code: 200, payload:req.session.user, token: access_token})
}

export const gitHubLogin = async(req, res)=>{
    let user = req.user;
    user = {
        name : `${user.first_name} ${user.last_name}`,
        email: user.username,
        age: user.age,
        rol: 'usuario'
    }
    const access_token = generateJWToken(user,time);
    res.cookie('commerceCookieToken', access_token, {
        maxAge: 60*60*1000,
        httpOnly: true
    }).send({status:"success", code: 200, payload:req.session.user, token: access_token})
    res.redirect("/github");
}
export const register = async (req, res)=>{
    const user = req.user;
    res.status(201).send({status: "success",code: 201, message: "User succesfully created with ID: " + user.id});
}
export const logout = async (req, res) => {
    try{
        res.clearCookie('commerceCookieToken');
        res.clearCookie('cartCookie');
        res.send({status:"success",code: 200, message:"Sesion cerrada correctamente!" })
    }
    catch(error) {
        req.logger.error(log(error.message,req));
        res.send({error: "error logout",code: 400, message: "Error occured closing the session"});
    }
}
export const resetPasswordConfirm = async (req,res) => {
    try{
        const {username,link} = req.body;
        let requestData = {
            method:"POST",
            body: JSON.stringify({email:username,link:link}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        const request = new Request(config.endpoint+config.port+'/api/mail/resetPass', requestData)
        const result = await fetch(request).then( (response) => response.json());
        if(result.error){
            throw {
                error:  result.error, 
                message: result.message
            }
        }
        res.status(201).send({status: "success",code: 201, message: "Mail to reset password sended"});
    }
    catch(error) {
        res.status(500).send(error);
    }
}
export const resetPassword = async (req,res) => {
    try{
        const {username, newPassword, confirmNewPassword} = req.body;
        const user = await userService.getUserByUsername(username);
        if(!user) return res.status(401).send({status:"error",message:"User not found"});
        if(isValidPassword(user,newPassword)) return res.status(403).send({status: "error", error:"Your new password and your old one cant't be the same"});    
        if (newPassword !== confirmNewPassword){
            return res.status(400).send({status: "error", message: "Password must be confirmed"});
        }
        user.password = createHash(newPassword);
        const result = await userService.updateUser({_id:user._id},user);
        res.status(201).send({status: "success",code: 201, message: "Password reseted succesfully"});
    }
    catch(error) {
        res.status(400).send({
            status:'error',
            message: error.message
        });
    }
}
export const updateSession = async (req,res) => {
    let user = req.user.user;
    let cart = req.user.cart?req.user.cart:null;
    req.logger.debug(log("Update de sesión",req))
    user = {
        name : `${user.first_name} ${user.last_name}`,
        email: user.username,
        age: user.age,
        role: user.role
    }  
    const access_token = generateJWToken(user,'24h');
    if(cart){
        cart = JSON.stringify(cart)
        res.cookie("cartCookie", cart, {
            maxAge: 24*60*60*1000
        })
    }
    res.cookie('commerceCookieToken', access_token, {
        maxAge: 24*60*60*1000,
        httpOnly: true
    }).send({status:"success", code: 200, payload:req.session.user, token: access_token})
}
