import { createHash, isValidPassword, generateJWToken } from '../util.js';

export const login = async (req, res)=>{
    let user = req.user
    user = {
        name : `${user.first_name} ${user.last_name}`,
        email: user.username,
        age: user.age,
        role: user.role
    }  
    const access_token = generateJWToken(user);
    const cart = JSON.stringify(req.user.cart)
    res.cookie("cartCookie", cart, {
        maxAge: 24*60*60*1000
    })
    res.cookie('commerceCookieToken', access_token, {
        maxAge: 20*60*1000,
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
    const access_token = generateJWToken(user);
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
        res.send({status:"success",code: 200, message:"Sesion cerrada correctamente!" })
    }
    catch(error) {
        res.send({error: "error logout",code: 400, message: "Error occured closing the session"});
    }
}
export const resetPassword = async (req,res) => {
    try{
        const {username, newPassword} = req.body;
        const confirm_password = req.body["confirm-password"]
        const user = await userService.getUserByUsername(username);
        if(!user) return res.status(401).send({status:"error",message:"User not found"});
        if(isValidPassword(user,newPassword)) return res.status(403).send({status: "error", error:"Your new password and your old one cant't be the same"});    
        if (newPassword !== confirm_password){
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
