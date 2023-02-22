import Express from "express";
import handlebars from 'express-handlebars';
import product_router from "./Routes/products.router.js";
import carts_router from "./Routes/carts.router.js";
import views_router from "./Routes/view.router.js";
import __dirname from "./util.js";
import {Server} from 'socket.io'

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

socketServer.on('connection', socket => {
    console.log("Cliente conectado");
    socket.on('products', data => {
        console.log(data);
    })
    socket.emit('products', data => {

    })
})
/*const error_middleware = (req, res, next) => {
    next()
}*/