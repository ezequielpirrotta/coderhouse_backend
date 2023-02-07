import ProductManager from "./ProductManager.js";
import Express, { query, response } from "express";

const SERVER_PORT = 8080;

let pm = new ProductManager("./files/products.json");

const app = Express()
app.use(Express.urlencoded({extended: true}));

app.get('/products', async (request, response) => {
    let {limit} = request.query
    limit = parseInt(limit);
    //console.log(typeof limit)
    let products = await pm.getProducts();
    if(limit !== undefined) {
        products = limit > 0? products.slice(0, limit) : [] 
        //console.log(products)
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




/*
for(let i = 9; i <= 12; i++){
    let title = "producto prueba_"+i;
    let description = "Este es un producto prueba";
    let price = 20+i;
    let thumbnail = "Sin imagen";
    let code = "abc135"+i;
    let stock = 25;
    console.log("hola "+i)
    await pm.addProduct(title, description, price, thumbnail, code, stock);
}*/

//console.log( await pm.getProducts());

//console.log(await pm.getProductById(228))
/*await pm.updateProduct({
    id: 228,
    field: "title",
    newValue: "testeoo"
})
console.log("Productos actualizados")
console.log(await pm.getProducts())
/*
pm.deleteProduct(521)
console.log("Productos actualizados eliminación")
console.log(pm.getProducts())
*/