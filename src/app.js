//Express imports
import Express from "express";
import session from 'express-session';
import cors from 'cors';
//Routers imports
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ticketsRouter from './routes/tickets.router.js';
import usersRouter from './routes/users.router.js';
import sessionsRouter from "./routes/sessions.router.js";
import githubRouter from "./routes/github-login.views.router.js";
import emailRouter from "./routes/email.router.js";
import mockingRouter from "./routes/mocks/products.router.mock.js"
import logRouter from "./routes/log.router.js"
//Other imports
import MongoStore from 'connect-mongo';
import __dirname from "./util.js";
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


/*f(cluster.isPrimary) {
    
    const cpusNumber = cpus().length;
    console.log("Nro de cpus:")
    console.log(cpusNumber)
    for(let i = 0; i < cpusNumber-1; i++) {
        cluster.fork().on('error', err => console.error({err, message: 'Ocurrió un error'}))
    }
}
else{*/
    console.log("Soy worker!, proceso: "+process.pid)
    const app = Express()
    app.use(cors({origin:config.frontUrl,methods:['GET','POST','PUT','DELETE'], credentials: true}))
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
    app.use(cookieParser(config.privateKey))
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
    app.use("/api/sessions", sessionsRouter);
    app.use("/api/mail", emailRouter);
    app.use('/github',githubRouter);
    app.use('/mockingproducts', mockingRouter);
    app.use('/loggerTest', logRouter);
    /*** Server ***/
    app.listen(config.serverPort);
    /*const httpServer = 
    const socketServer = new Server(httpServer,{
        cors: {
            origin: config.frontUrl,
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });
    app.use(Express.static('react-layer'));*/
 /*}*/