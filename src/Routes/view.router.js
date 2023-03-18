import { Router } from "express";
import socketServer from "../app.js";

const router = Router()
const endpoint = 'http://localhost:8080'

router.get('/', async  (req, res) => {
    let data = {
        products: [],
    };
    data.products = await fetch(endpoint+'/api/products')
    .then( (response) => response.json());
    res.render('home', data);
})
router.get('/realTimeProducts', async (req, res) => {
    
    let data = {
        products: [],
    };
    data.products = await fetch(endpoint+'/api/products')
    .then( (response) => response.json());
    res.render('realTimeProducts', data);
})
router.get("/message", (req, res)=>{
    res.render("messages");
});

export default router