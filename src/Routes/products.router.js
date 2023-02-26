import { Router } from "express";
import ProductManager from "../Managers/ProductManager.js";

const pm = new ProductManager("./files/products.json");
const router = Router()

router.get('/', async (req, res) => {
    try {
        let {limit} = req.query
        let products = await pm.getProducts();
        if(limit !== undefined) {
            limit = parseInt(limit);
            products = limit > 0? products.slice(0, limit) : []; 
        }
        res.status(200).send(products);
    }
    catch(e) {
        res.status(404).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        let product = await pm.getProductById(id);
        res.status(200).send(product);
    }
    catch(e) {
        res.status(404).send({
            status: 'WRONG',
            code: e.code,
            message: e.message,
            detail: e.detail
        });
    }
})

router.post('/', async (req, res) => {
    let product = req.body;
    try {
        product = await pm.addProduct(
            product.title,
            product.description,
            product.price,
            product.code,
            product.stock,
            product.category,
            product.thumbnail
        )
        res.status(200).send({
            status: 'OK',
            message: "Producto creado correctamente",
            data: product
        });
    }
    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            code: 409,
            message: e.message,
            detail: e.detail
        });
    }
})

router.put('/:id', async (req, res) => {
    let id = req.params.id
    console.log(req.body)
    let new_product = {
        id: id,
        field: req.body.field,
        newValue: req.body.newValue
    }
    console.log(new_product)
    try {
        let result = await pm.updateProduct(new_product)
        console.log(result)
        res.status(200).send({
            status: 'OK',
            message: "Producto actualizado correctamente",
            data: new_product
        })
    }
    catch(e) {
        res.status(e.code).send({
            status: 'WRONG',
            message: e.message,
            detail: e.detail,
            data: new_product
        })
    }
})

router.delete('/:id', async (req, res) => {
    let id = req.params.id;
    try {
        id = parseInt(id)
        await pm.deleteProduct(id);
        res.status(200).send({
            status: 'OK',
            message: "Producto eliminado correctamente",
            data: {id: id}
        })
    }
    catch (e) {
        res.status(409).send({
            status: 'WRONG',
            message: e.message,
            detail: e.detail,
            data: {id: id}
        })
    }

})

export default router