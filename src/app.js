import Express from "express";
import handlebars from 'express-handlebars';
import session from 'express-session';
import productRouter from "./Routes/products.router.js";
import cartsRouter from "./Routes/carts.router.js";
import viewsRouter from "./Routes/view.router.js";
import usersViewRouter from "./Routes/users.views.router.js";
import sessionsRouter from "./Routes/sessions.router.js";
import MongoStore from 'connect-mongo';
import __dirname from "./util.js";
import {Server} from 'socket.io'
import mongoose from "mongoose";
import error_middleware from "./Middlewares/error_handler_middleware.js";

export const endpoint = 'http://localhost:8080';
const SERVER_PORT = 8080;
const app = Express()
/*** DB ***/
const MONGO_URL = "mongodb+srv://ezequielpdesarrollo:DhLxBaXZaUYdyqwP@e-commerce.uelsobh.mongodb.net/e-commerce?retryWrites=true&w=majority"
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URL);
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

app.use(session({
    //ttl: Time to live in seconds,
    //retries: Reintentos para que el servidor lea el archivo del storage.
    //path: Ruta a donde se buscará el archivo del session store.
    //store: new fileStorage({path : "./sessions", retries: 0}),
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 260
    }),
    secret: "coderS3cr3t",
    resave : false,
    saveUninitialized: true
}));
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
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
/*** Middlewares y Cookies***/
productRouter.use(error_middleware);
cartsRouter.use(error_middleware);

/*** Server ***/
const httpServer = app.listen(SERVER_PORT);
const socketServer = new Server(httpServer);
app.set("socket", socketServer);
app.set("enpoint".endpoint)

socketServer.on("connection",socket  => {
    console.log(`Cliente ${socket.id} conectado!!`)
    /**Products events */
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
    /**Carts events */
    socket.on("event_add_product_to_cart", async (data) => {
        let request = {};
        if(data.isNewCart) {
            let requestData = {
                method:"POST",
                body: JSON.stringify(data.body),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }
            request = new Request(endpoint+'/api/carts', requestData)
        }
        else {
            let requestData = {
                method:"PUT",
                body: JSON.stringify(data.body),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                }
            }
            request = new Request(endpoint+'/api/carts/'+data.cart_id+'/product', requestData) 
        } 
        let result = await fetch(request)
        .then( (response) => response.json());
        if(result.status === "WRONG") {
            socketServer.emit("event_adding_cart_error",{...result})
        }
        else {
            socketServer.emit("event_cart_added", {id: data.cart_id})
        }
    })
})
export default socketServer;