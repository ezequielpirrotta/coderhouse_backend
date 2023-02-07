import ProductManager from "./ProductManager.js";
import Express, { query, response } from "express";

const SERVER_PORT = 8080;

let pm = new ProductManager("./files/products.json");

const app = Express()
app.use(Express.urlencoded({extended: true}));

app.get('/products', async (request, response) => {
    let {limit} = request.query
    limit = parseInt(limit);
    let products = await pm.getProducts();
    if(limit !== undefined) {
        products = limit > 0? products.slice(0, limit) : [] 
        response.send(products);
    }
    else {
        response.send(products)
    }
})

app.get('/products/:id', async (request, response) => {
    try {

        let id = parseInt(request.params.id);
        let product = await pm.getProductById(id)
        response.send(product)
    }
    catch(e) {
        let error = { message: e.message, code: e.code}
        response.send(error)
    }
})

app.listen(SERVER_PORT)
