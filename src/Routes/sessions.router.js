import { Router } from 'express';
import passport from 'passport';
import userModel from '../Dao/models/user.model.js';
import { createHash, isValidPassword, generateJWToken, passportCall } from '../util.js';

const router = Router();
const admin_credentials = {username: 'adminCoder@coder.com', password: 'adminCod3r123'};

router.get("/github", passport.authenticate('github', {scope: ['user:email']}), async (req, res) => {});

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/github/error'}), async(req, res)=>{
    let user = req.user;
    user = {
        name : `${user.first_name} ${user.last_name}`,
        email: user.username,
        age: user.age,
        rol: 'usuario'
    }
    req.session.user = user;
    res.redirect("/github");
}); 
router.post("/register", passport.authenticate( 
    'register', {failureRedirect: '/api/sessions/fail-register'}), async (req, res)=>{
    const user = req.user;
    res.status(201).send({status: "success",code: 201, message: "User succesfully created with ID: " + user.id});
});

router.post("/login", passport.authenticate('login', {failureRedirect: '/api/sessions/fail-login'}), async (req, res)=>{
    let user = req.user
    user = {
        name : `${user.first_name} ${user.last_name}`,
        email: user.username,
        age: user.age,
        role: user.role
    }  
    const access_token = generateJWToken(user);
    res.cookie('commerceCookieToken', access_token, {
        maxAge: 3*60*1000,
        httpOnly: true
    }).send({status:"success", code: 200, payload:req.session.user, token: access_token})
});
router.get("/logout", (req, res) => {
    let user = req.session.user;
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout",code: 400, message: "Error occured closing the session"});
        }
        res.send({status:"success",code: 200, payload: user, message:"Sesion cerrada correctamente!" });
    });
});
router.post("/resetPassword", async (req,res) => {
    try{
        const {username, newPassword} = req.body;
        const confirm_password = req.body["confirm-password"]
        const user = await userModel.findOne({username});
        if(!user) return res.status(401).send({status:"error",message:"User not found"});
        if(isValidPassword(user,newPassword)) return res.status(403).send({status: "error", error:"Your new password and your old one cant't be the same"});    
        if (newPassword !== confirm_password){
            return res.status(400).send({status: "error", message: "Password must be confirmed"});
        }
        user.password = createHash(newPassword);
        const result = await userModel.updateOne(user);
        res.status(201).send({status: "success",code: 201, message: "Password reseted succesfully"});
    }
    catch(error) {
        res.status(400).send({
            status:'error',
            message: error.message
        });
    }
});
router.get('/current', passportCall('current'), (req,res) =>{
    res.status(401).send(req.user);
})
router.get('/fail-register', (req, res)=>{
    res.status(401).send({error: res.message});
});
router.get("/fail-login", (req, res) => {
    res.status(401).send({error: res.message});
});

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        let user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        console.error("Error deserializando el usuario: " + error);
    }
});
export default router;