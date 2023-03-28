import { Router } from 'express';
import userModel from '../Dao/models/user.model.js';

const router = Router();
const admin_credentials = {username: 'adminCoder@coder.com', password: 'adminCod3r123'}; 
router.post("/register", async (req, res)=>{
    const { first_name, last_name, username, age, password} = req.body;
    if(!username) {
        return res.status(400).send({status: "error", message: "Email vacio"});
    }
    const exists = await userModel.findOne({username});
    if (exists){
        return res.status(400).send({status: "error", message: "Usuario ya existe."});
    }
    const user = {
        first_name: first_name,
        last_name: last_name,
        username: username,
        age: age,
        password: password
    };
    const result = await userModel.create(user);
    res.status(201).send({status: "success",code: 201, message: "Usuario creado con extito con ID: " + result.id});
});

router.post("/login", async (req, res)=>{
    const {username, password} = req.body;
    const user = await userModel.findOne({username,password});
    if(!user) return res.status(401).send({status:"error",message:"Incorrect credentials"});

    if (username === admin_credentials.username || password === admin_credentials.password){
        req.session.user= {
            name : `${user.first_name} ${user.last_name}`,
            email: user.username,
            age: user.age,
            rol: 'admin'
        }  
    }
    else{
        req.session.user= {
            name : `${user.first_name} ${user.last_name}`,
            email: user.username,
            age: user.age,
            rol: 'usuario'
        } 
    }
    res.send({status:"success",code: 200, payload:req.session.user, message:"¡Primer logueo realizado! :)" });
});
router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", messagee: "Error al cerrar la sesion"});
        }
        res.send({status:"success",code: 200, payload:req.session.user, message:"Sesion cerrada correctamente!" });
    });
});
export default router;