import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";

const router = Router()
const pm = new ProductManager("./files/products.json");

router.get('/', async (req, res) => {
    let data = {
        products: await pm.getProducts()
    }
    res.render('home',data);
})
router.get('/realTimeProducts', async (req, res) => {
    let data = {
        products: await pm.getProducts()
    }
    res.render('realTimeProducts',data);
})
export default router