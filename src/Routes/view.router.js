import { Router } from "express";
import socketServer from "../app.js";
import { endpoint } from "../app.js";

const router = Router()

router.get('/', async  (req, res) => {
    let data = {
        products: [],
    };
    data.products = await fetch(endpoint+'/api/products')
    .then( (response) => response.json());      
    res.render('home', data);
})
router.get('/realTimeProducts', async (req, res) => {
    
    let data = {
        products: [],
    };
    data.products = await fetch(endpoint+'/api/products')
    .then( (response) => response.json());
    res.render('realTimeProducts', data);
})
router.get('/products', async (req, res) => {
    
    let data = {
        products: [],
    };
    let params = '';
    if(req.query) {
        
        params = params+'?'
        
        params = req.query.limit? params.length>1? params+'&limit='+req.query.limit : params+'limit='+req.query.limit : params
        params = req.query.page? params.length>1? params+'&page='+req.query.page:params+'page='+req.query.page : params
        params = req.query.sort? params.length>1? params+'&sort='+req.query.sort:params+'sort='+req.query.sort : params
        params = req.query.category? params.length>1? params+'&category='+req.query.category:params+'category='+req.query.category : params
        params = req.query.available? params.length>1? params+'&available='+req.query.available:params+'available='+req.query.available : params
    } 
    data.products = await fetch(endpoint+'/api/products'+params)
    .then( (response) => response.json());
    
    data.products.prevLink = data.products.hasPrevPage? `${endpoint}/products?page=${data.products.prevPage}`:'';

    data.products.nextLink = data.products.hasNextPage? `${endpoint}/products?page=${data.products.nextPage}`:'';
    data.pages = []
    for (let i = 0; i < data.products.totalPages; i++) {
        data.pages[i] = {
            page: i+1,
            isCurrentPage: data.products.page === i+1? true:false,
            link: `${endpoint}/products?page=${i+1}`
        };
    }
    res.render('products', data);
})
router.get('/carts/:cid', async (req, res) => {
    let {cid} = req.params;
    let data = {
        products: [],
    };
    data.products = await fetch(endpoint+'/api/carts/'+cid)
    res.render('products', data);
})

export default router