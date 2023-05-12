//Express imports
import Express from "express";
import handlebars from 'express-handlebars';
import session from 'express-session';
import cors from 'cors';
//Routers imports
import productRouter from "./Routes/products.router.js";
import cartsRouter from "./Routes/carts.router.js";
import ticketsRouter from './Routes/tickets.router.js';
import usersRouter from './Routes/users.router.js';
import viewsRouter from "./Routes/view.router.js";
import usersViewRouter from "./Routes/users.views.router.js";
import sessionsRouter from "./Routes/sessions.router.js";
import githubRouter from "./Routes/github-login.views.router.js";
import emailRouter from "./Routes/email.router.js";
//Other imports
import MongoStore from 'connect-mongo';
import __dirname, { PRIVATE_KEY } from "./util.js";
import {Server} from 'socket.io'
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
//Midlewares imports
import error_middleware from "./middlewares/error_handler_middleware.js";
//Passport imports
import passport from "passport";
import initializePassport from "./config/passport.config.js";
//Environment
import config from "./config/config.js";

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
app.use(cors({origin:"http/localhost:3000",methods:['GET','POST','PUT','DELETE']}))
app.use(Express.static(__dirname+'/public'));
/*** Views ***/ 
app.engine('handlebars', handlebars.engine())
app.set('views',__dirname + '/views');
app.set('view engine', 'handlebars');
/*** Middlewares y Cookies***/
productRouter.use(error_middleware);
cartsRouter.use(error_middleware);
app.use(cookieParser(PRIVATE_KEY))
//Middlewares de Passport
initializePassport();
app.use(passport.initialize());
app.use(session());
/*** Routers ***/
app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketsRouter);
app.use('/api/users', usersRouter)
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mail", emailRouter);
app.use('/github',githubRouter);
/*** Server ***/
const httpServer = app.listen(config.port);
const socketServer = new Server(httpServer);
app.set("socket", socketServer);

socketServer.on("connection",socket  => {
    console.log(`Cliente ${socket.id} conectado!!`)
    /** Products events **/
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
        let request = new Request(config.endpoint+config.port+'/api/products/'+data.id, requestData) 
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
        let request = new Request(config.endpoint+config.port+'/api/products/'+data.id, requestData) 
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
        let request = new Request(config.endpoint+config.port+'/api/products/', requestData) 
        let result = await fetch(request)
        .then( (response) => response.json());
        if(result.status === "WRONG") {
            socketServer.emit("event_creating_error", result)
        }
        else {
            socketServer.emit("event_product_created", {...result.data})
        }
    })
    /** User events **/
    socket.on('event_logout_user', async () => {
        
    })
})
export default socketServer;