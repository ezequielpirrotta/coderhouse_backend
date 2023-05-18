import React, { useState , useEffect, useContext} from "react";
import ItemList from "./ItemList";
import { useParams } from "react-router-dom";
import { CartContext } from "../carts/CartContext";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const port = '3000';
const endpoint = 'http://localhost:';

function ItemListContainer() 
{
    const [products, setProducts] = useState([]);
    const urlParams = useParams();
    
    useEffect(  () => {
            
        const getCookie = (nombre) => {
            const miCookie = Cookies.get(nombre);
            console.log(miCookie);
            // Aquí puedes hacer cualquier otra acción con el valor de la cookie obtenida
        };
        try {
            const getProducts = async () => {
                let result = await fetch(endpoint+port+'/api/products/').then((response)=>response.json())
                console.log(result.payload);
                let data = {};
                let params = '';
                if(urlParams) {
                    
                    params = params+'?'
                    
                    params = urlParams.limit? params.length>1? params+'&limit='+urlParams.limit : params+'limit='+urlParams.limit : params
                    params = urlParams.page? params.length>1? params+'&page='+urlParams.page : params+'page='+urlParams.page : params
                    params = urlParams.sort? params.length>1? params+'&sort='+urlParams.sort : params+'sort='+urlParams.sort : params
                    params = urlParams.category? params.length>1? params+'&category='+urlParams.category : params+'category='+urlParams.category : params
                    params = urlParams.available? params.length>1? params+'&available='+urlParams.available : params+'available='+urlParams.available : params
                } 
                data.products = await fetch(endpoint+port+'/api/products'+params)
                .then( (response) => response.json());
                
                if(data.products.status === "WRONG" || data.products.error){
                    data.founded = false;
                    return (
                        <div class="row justify-content-center">
                            <div class="col-md-12 alert alert-danger" role="alert">{products.detail}</div>
                        </div>
                    )
                }
                else {
                    
                    data.token = getCookie("commerceCookieToken")
                    data.products.prevLink = data.products.hasPrevPage? `${endpoint+port}/products?page=${data.products.prevPage}`:'';
    
                    data.products.nextLink = data.products.hasNextPage? `${endpoint+port}/products?page=${data.products.nextPage}`:'';
                    for (const key in urlParams) {
                        if(key !== "page"){
                            let result = params.search(key);
                            data.products.prevLink = result >= 0? data.products.prevLink+'&'+key+'='+urlParams[key] : data.products.prevLink;
                            data.products.nextLink = result >= 0? data.products.nextLink+'&'+key+'='+urlParams[key] : data.products.nextLink;
                        }
                    }
                    data.pages = []
                    for (let i = 0; i < data.products.totalPages; i++) {
                        data.pages[i] = {
                            page: i+1,
                            isCurrentPage: data.products.page === i+1? true:false,
                            link: `${config.endpoint+config.port}/products?page=${i+1}`
                        };
                        for (const key in urlParams) {
                            if(key !== "page"){
                                let result = params.search(key);
                                data.pages[i].link = result >= 0? data.pages[i].link+'&'+key+'='+urlParams[key] : data.pages[i].link; 
                            }
                        }
                    }
                    data.founded = true;
                    if(getCookie("commerceCookieToken")) {
                        let cart = JSON.parse(getCookie("commerceCookieToken"))
                        data.isCart = cart.products.length > 0
                        let total = 0;
                        cart.products.forEach(element => {
                            total += element.price    
                        });
                        data.totalCart = total; 
                    }
                }
            }
            let products = getProducts()
            if(products.error){
                Swal.fire({
                    title:"Error",
                    icon:"error",
                    text: products.message
                })
            }
            else {
                setProducts(products);
            }
        }
        catch(error) {
            Swal.fire({
                title:"Error",
                icon:"error",
                text: error.message
            })
        }
        
    }, [cat]);
    return (
        <div id="main" class="container-fluid justify-content-center">
            <div className="row nav-bar m-2">
                <nav className="col navbar fixed-top">
                    <ul id="navBarList" class="navbar-nav nav-bar flex-row justify-content-center">
                        <li class="nav-item col-md-6 justify-content-center">
                            <h1>Bienvenido!</h1>
                        </li>
                        <li class="nav-item col-md-6 justify-content-end"> 
                            {
                                products.token?
                                    <div>
                                        <button id="btn_profile" class="active btn btn-primary" aria-current="page" href={{linkProfile}}>Perfil</button>
                                        <button id="btn_close_session" class="active btn btn-danger" href="" aria-current="page" >Cerrar Sesion</button>
                                        <a class="active btn btn-primary" aria-current="page" href="/chat">Prueba nuestro chat!</a>
                                    </div>
                                    :
                                    <button id="btn_login" class="active btn btn-primary" aria-current="page">Iniciar sesion</button>
                            }    
                            <a href="/products">
                                <button id="" type="button" className="btn">
                                    <img src="/img/cart2.svg" alt="Carrito" width="25"/>
                                    {
                                        isCart? 
                                        <span id="cart_items" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                            {{totalCart}} 
                                        </span>
                                        :null
                                    }   
                                </button>
                            </a>
                        </li>
                    </ul>
                </nav>   
            </div>
            <ItemList products={products}/>
        </div>
    );
}

export default ItemListContainer;