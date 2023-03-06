import Express from "express";
import handlebars from 'express-handlebars';
import product_router from "./Routes/products.router.js";
import carts_router from "./Routes/carts.router.js";
import views_router from "./Routes/view.router.js";
import __dirname from "./util.js";
import {Server} from 'socket.io'

const endpoint = 'http://localhost:8080'
const SERVER_PORT = 8080;
const app = Express()


app.use(Express.urlencoded({extended: true}));
app.use(Express.json());
app.use(Express.static(__dirname+'/public'));

app.engine('handlebars', handlebars.engine())
app.set('views',__dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/', views_router);
app.use('/api/products', product_router);
app.use('/api/carts', carts_router);

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
            socketServer.emit("event_product_updated", {id: data.id, ...change})
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
            socketServer.emit("event_creating_error", {id: data.id, e: result.detail})
        }
        else {
            socketServer.emit("event_product_created", {id: data.id, ...result.data})
        }
    })
})
export default socketServer;
/*const error_middleware = (req, res, next) => {
    next()
}*/