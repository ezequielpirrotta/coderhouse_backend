import { Router } from "express";
//import socketServer from "../app.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { passportCall } from "../util.js";
import config from "../config/config.js";
const router = Router()

router.use(cookieParser())
router.get('/setCookie', (req, res) => {
    res.cookie('idSesion', 'dg65d4fgsd6f5g',{maxAge: 30000}).send('Cookie')
})
router.get('/getCookie', (req, res) => {
    res.send(req.cookies)
})
router.use(session({
    secret: "codigoSecreto",
    resave:true
}))
router.get('/', async (req, res) => {
    res.render("login");
})
router.get('/staticProducts', async  (req, res) => {
    let data = {
        products: [],
    };
    data.products = await fetch(config.endpoint+config.port+'/api/products')
    .then( (response) => response.json());      
    res.render('home', data);
})
router.get('/realTimeProducts', async (req, res) => {
    
    let data = {
        products: [],
    };
    data.products = await fetch(config.endpoint+config.port+'/api/products')
    .then( (response) => response.json());
    res.render('realTimeProducts', data);
})
router.get('/products', async function(req, res) {
    let data = {};
    let params = '';
    if(req.query) {
        
        params = params+'?'
        
        params = req.query.limit? params.length>1? params+'&limit='+req.query.limit : params+'limit='+req.query.limit : params
        params = req.query.page? params.length>1? params+'&page='+req.query.page:params+'page='+req.query.page : params
        params = req.query.sort? params.length>1? params+'&sort='+req.query.sort:params+'sort='+req.query.sort : params
        params = req.query.category? params.length>1? params+'&category='+req.query.category:params+'category='+req.query.category : params
        params = req.query.available? params.length>1? params+'&available='+req.query.available:params+'available='+req.query.available : params
    } 
    data.products = await fetch(config.endpoint+config.port+'/api/products'+params)
    .then( (response) => response.json());
    if(data.products.status === "WRONG"){
        data.founded = false;
        res.render('products', data);
    }
    else {
        
        data.token = req.cookies["commerceCookieToken"]
        data.products.prevLink = data.products.hasPrevPage? `${config.endpoint+config.port}/products?page=${data.products.prevPage}`:'';

        data.products.nextLink = data.products.hasNextPage? `${config.endpoint+config.port}/products?page=${data.products.nextPage}`:'';
        for (const key in req.query) {
            if(key !== "page"){
                let result = params.search(key);
                data.products.prevLink = result >= 0? data.products.prevLink+'&'+key+'='+req.query[key] : data.products.prevLink;
                data.products.nextLink = result >= 0? data.products.nextLink+'&'+key+'='+req.query[key] : data.products.nextLink;
            }
        }
        data.pages = []
        for (let i = 0; i < data.products.totalPages; i++) {
            data.pages[i] = {
                page: i+1,
                isCurrentPage: data.products.page === i+1? true:false,
                link: `${config.endpoint+config.port}/products?page=${i+1}`
            };
            for (const key in req.query) {
                if(key !== "page"){
                    let result = params.search(key);
                    data.pages[i].link = result >= 0? data.pages[i].link+'&'+key+'='+req.query[key] : data.pages[i].link; 
                }
            }
        }
        data.founded = true;
        if(req.cookies["cartCookie"]) {
            let cart = JSON.parse(req.cookies["cartCookie"])
            data.isCart = cart.products.length > 0
            let total = 0;
            cart.products.forEach(element => {
                total += element.price    
            });
            data.totalCart = total; 
        }
        res.render('products', data);
    }
})
router.get('/carts/:cid', async (req, res) => {
    let {cid} = req.params;
    let data = {
        cart: [],
    };
    data.cart = await fetch(config.endpoint+config.port+'/api/carts/'+cid)
    .then( (response) => response.json())
    res.render('carts', data);
})

export default router