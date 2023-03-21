import Express from "express";
import handlebars from 'express-handlebars';
import product_router from "./Routes/products.router.js";
import carts_router from "./Routes/carts.router.js";
import views_router from "./Routes/view.router.js";
import __dirname from "./util.js";
import {Server} from 'socket.io'
import mongoose from "mongoose";
import error_middleware from "./Middlewares/error_handler_middleware.js";

/*** DB ***/
const connectToMongoDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://ezequielpdesarrollo:DhLxBaXZaUYdyqwP@e-commerce.uelsobh.mongodb.net/e-commerce?retryWrites=true&w=majority");
    }
    catch(error){
        throw {
            code: 404,
            message: "Error encontrando/creando la base de datos.",
            detail: `${error.message}`
        }
    }
}
connectToMongoDB();

export const endpoint = 'http://localhost:8080';
const SERVER_PORT = 8080;
const app = Express()

/**** Utils ***/
app.use(Express.urlencoded({extended: true}));
app.use(Express.json());
app.use(Express.static(__dirname+'/public'));
/*** Views ***/ 
app.engine('handlebars', handlebars.engine())
app.set('views',__dirname + '/views');
app.set('view engine', 'handlebars');
/*** Routers ***/
app.use('/', views_router);
app.use('/api/products', product_router);
app.use('/api/carts', carts_router);
product_router.use(error_middleware);
carts_router.use(error_middleware);
/*** Server ***/
const httpServer = app.listen(SERVER_PORT);
const socketServer = new Server(httpServer);
app.set("socket", socketServer);

socketServer.on("connection",socket  => {
    console.log(`Cliente ${socket.id} conectado!!`)
    socket.on("event_update_product", async (data) => {
        let change = {
            field: data.field,
            newValue: data.newValue
        }
        let requestData = {
            method:"PUT",
            body: JSON.stringify(change),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        let request = new Request(endpoint+'/api/products/'+data.id, requestData) 
        let result = await fetch(request)
        .then( (response) => response.json());
        if(result.status === "WRONG") {
            socketServer.emit("event_updating_error", {id: data.id, e: result.detail})
        }
        else {
            socketServer.emit("event_product_updated", {id: data.id, ...result.data})
        }  
    })
    socket.on("event_delete_product", async (data) => {
        let requestData = {
            method:"DELETE",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        let request = new Request(endpoint+'/api/products/'+data.id, requestData) 
        let result = await fetch(request)
        .then( (response) => response.json());
        if(result.status === "WRONG") {
            socketServer.emit("event_deleting_error", {id: data.id, e: result.detail})
        }
        else {
            socketServer.emit("event_product_deleted", {id: data.id})
        }
    })
    socket.on("event_create_product", async (data) => {
        data['front'] = true;
        let requestData = {
            method:"POST",
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        let request = new Request(endpoint+'/api/products/', requestData) 
        let result = await fetch(request)
        .then( (response) => response.json());
        if(result.status === "WRONG") {
            socketServer.emit("event_creating_error", result)
        }
        else {
            socketServer.emit("event_product_created", {...result.data})
        }
    })
})
export default socketServer;