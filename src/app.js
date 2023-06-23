//Express imports
import Express from "express";
import session from 'express-session';
import cors from 'cors';
//Routers imports
import productRouter from "./Routes/products.router.js";
import cartsRouter from "./Routes/carts.router.js";
import ticketsRouter from './Routes/tickets.router.js';
import usersRouter from './Routes/users.router.js';
import sessionsRouter from "./Routes/sessions.router.js";
import githubRouter from "./Routes/github-login.views.router.js";
import emailRouter from "./Routes/email.router.js";
import cookieRouter from "./Routes/cookie.router.js";
import mockingRouter from "./Routes/mocks/products.router.mock.js"
import logRouter from "./Routes/log.router.js"
//Other imports
import MongoStore from 'connect-mongo';
import __dirname, { PRIVATE_KEY } from "./util.js";
import {Server} from 'socket.io'
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import CustomError from "./services/errors/CustomError.js";
import EErrors from "./services/errors/errors-enum.js";
//Midlewares imports
import { addLogger } from "./config/logger.js";
//Passport imports
import passport from "passport";
import initializePassport from "./config/passport.config.js";
//Environment
import config from "./config/config.js";
import cluster from "cluster"
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUIExpress from "swagger-ui-express";
import { cpus } from "os";


if(cluster.isPrimary) {
    
    const cpusNumber = cpus().length;
    console.log("Nro de cpus:")
    console.log(cpusNumber)
    for(let i = 0; i < cpusNumber-1; i++) {
        cluster.fork()
    }
}
else{
    console.log("Soy worker!, proceso: "+process.pid)
    const app = Express()
    app.use(cors({origin:"http://localhost:3000",methods:['GET','POST','PUT','DELETE'], credentials: true}))
    /*** DB ***/
    const connectToMongoDB = async () => {
        try {
            await mongoose.connect(config.mongoUrl);
        }
        catch(error){
            CustomError.createError({
                name: "Data Base connection/creation error",
                cause: generateProductErrorInfo({url: config.mongoUrl, message: error.message}),
                message: "Error trying to connect/create DB ",
                code: EErrors.DATABASE_ERROR
            })
        }
    }
    connectToMongoDB();
    app.use(session({
        store: MongoStore.create({
            mongoUrl: config.mongoUrl,
            mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
            ttl: 260
        }),
        secret: "coderS3cr3t",
        resave : false,
        saveUninitialized: true
    }));
    /**** Swagger ****/
    const swaggerOptions = {
        definition: {
            openapi: "3.0.1",
            info: {
                title: "Swagger E-commerce - OpenAPI 3.0",
                description: "Api docs with swagger",
                version: "1.0.0"
            }
        },
        apis: ['./src/docs/**/*.yaml']
    }
    const specs = swaggerJSDoc(swaggerOptions);
    //Declare swagger api endpoint
    app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));
    /**** Utils ****/
    app.use(Express.urlencoded({extended: true}));
    app.use(Express.json());
    app.use(Express.static(__dirname+'/public'));
    /*** Middlewares y Cookies***/
    app.use(cookieParser(PRIVATE_KEY))
    app.use(addLogger)
    //Middlewares de Passport
    initializePassport();
    app.use(passport.initialize());
    app.use(session({resave: true,saveUninitialized: true,secret: 'keyboard cat'}));
    /*** Routers ***/
    app.use('/api/products', productRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/api/tickets', ticketsRouter);
    app.use('/api/users', usersRouter);
    app.use('/cookies', cookieRouter);
    app.use("/api/sessions", sessionsRouter);
    app.use("/api/mail", emailRouter);
    app.use('/github',githubRouter);
    app.use('/mockingproducts', mockingRouter);
    app.use('/loggerTest', logRouter);
    /*** Server ***/
    const httpServer = app.listen(8080);
    const socketServer = new Server(httpServer,{
        cors: {
            origin: config.frontUrl,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });
    app.use(Express.static('react-layer'));
    let messages = [];
    socketServer.on("connection",socket  => {
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
            let request = new Request(config.serverUrl+'/api/products/'+data.id, requestData) 
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
            let request = new Request(config.serverUrl+'/api/products/'+data.id, requestData) 
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
            let request = new Request(config.serverUrl+'/api/products/', requestData) 
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
        /** Message Events **/
        socket.on("message", data => {
            messages.push(data);
            socketServer.emit("messageLogs", messages);
        });
        //Parte 2
        socket.on('userConnected', data => {
            console.log("User connected: " + data.user);
            socket.broadcast.emit("userConnected", data.user);
        });
        /*mensajes para implementación de react*/
        socket.on('send_message', (message) => {
            console.log('Mensaje recibido:', message);''
            // Emitir el mensaje a todos los clientes conectados
            socket.emit('get_message', message);
        });
        
        // Manejar desconexiones de socket
        socket.on('disconnect', () => {
            console.log('Un usuario se ha desconectado');
        });
    })
}