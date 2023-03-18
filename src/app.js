import Express from "express";
import handlebars from 'express-handlebars';
import productRouter from "./Routes/products.router.js";
import cartsRouter from "./Routes/carts.router.js";
import viewsRouter from "./Routes/view.router.js";
import messagesRouter from "./Routes/messages.router"
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

const endpoint = 'http://localhost:8080'
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
app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter)
/*** Uso de Middlewares ***/
productRouter.use(error_middleware);
cartsRouter.use(error_middleware);
messagesRouter.use(error_middleware);
/*** Server ***/
const httpServer = app.listen(SERVER_PORT);
const socketServer = new Server(httpServer);
app.set("socket", socketServer);


socketServer.on("connection",socket  => {
    console.log(`Cliente ${socket.id} conectado!!`)
    /* Eventos de Products */
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
    /* Eventos de Messages */
    socket.on("message", async (data) => {
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
            socketServer.emit("event_messageLogs", {...result.data})
        }
        messages.push(data);
        console.log(data);
        io.emit("messageLogs", messages);
    });
    //Parte 2
    socket.on('userConnected', data => {
        console.log("User connected: " + data.user);
        socket.broadcast.emit("userConnected", data.user);
    });
})
export default socketServer;