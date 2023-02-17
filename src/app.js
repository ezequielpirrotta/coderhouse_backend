import Express from "express";
import product_router from "./Routes/products.router.js";
import carts_router from "./Routes/carts.router.js";
import __dirname from "./util.js";

const SERVER_PORT = 8080;

const app = Express()

app.use(Express.urlencoded({extended: true}));
app.use(Express.json());
app.use('/static',Express.static(__dirname+'/public'))

app.use('/api/products', product_router);
app.use('/api/carts', carts_router);

app.listen(SERVER_PORT);
