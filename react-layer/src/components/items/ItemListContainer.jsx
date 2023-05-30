import React, { useState , useEffect, useContext} from "react";
import ItemList from "./ItemList";
import { useParams, useSearchParams } from "react-router-dom";
import { CartContext } from "../carts/CartContext";
import Swal from 'sweetalert2';
import { UserContext } from "../users/UserContext";

const port = '3000';
const server_port = '8080';
const endpoint = 'http://localhost:';

function ItemListContainer() 
{
    const {user,cart} = useContext(UserContext)
    const [products, setProducts] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const {limit,page,sort,category,available} = useParams()
    console.log(searchParams.get("category"))
    
    useEffect(  () => {
            
        
        const getProducts = async () => {
            try{

                let data = {};
                let params = '';
                const limit = searchParams.get("limit")
                const page = searchParams.get("page")
                const sort = searchParams.get("sort")
                const category = searchParams.get("category")
                const available = searchParams.get("available")

                if(limit||page||sort||category||available) {
                    
                    params = params+'?'
                    
                    params = limit? params.length>1? params+'&limit='+limit : params+'limit='+limit : params
                    params = page? params.length>1? params+'&page='+page : params+'page='+page : params
                    params = sort? params.length>1? params+'&sort='+sort : params+'sort='+sort : params
                    params = category? params.length>1? params+'&category='+category : params+'category='+category : params
                    params = available? params.length>1? params+'&available='+available : params+'available='+available : params
                } 
                console.log()
                data.products = await fetch(endpoint+port+'/api/products'+params)
                .then( (response) => response.json());
                
                if(data.products.status === "WRONG" || data.products.error){
                    data.founded = false;
                }
                else {
                    
                    data.token = user
                    data.products.prevLink = data.products.hasPrevPage? `${endpoint+port}/products?page=${data.products.prevPage}`:'';
    
                    data.products.nextLink = data.products.hasNextPage? `${endpoint+port}/products?page=${data.products.nextPage}`:'';
                    /*for (const key in urlParams) {
                        if(key !== "page"){
                            let result = params.search(key);
                            data.products.prevLink = result >= 0? data.products.prevLink+'&'+key+'='+urlParams[key] : data.products.prevLink;
                            data.products.nextLink = result >= 0? data.products.nextLink+'&'+key+'='+urlParams[key] : data.products.nextLink;
                        }
                    }*/
                    data.pages = []
                    for (let i = 0; i < data.products.totalPages; i++) {
                        data.pages[i] = {
                            page: i+1,
                            isCurrentPage: data.products.page === i+1? true:false,
                            link: `/products?page=${i+1}`
                        };
                        /*for (const key in urlParams) {
                            if(key !== "page"){
                                let result = params.search(key);
                                data.pages[i].link = result >= 0? data.pages[i].link+'&'+key+'='+urlParams[key] : data.pages[i].link; 
                            }
                        }*/
                    }
                    data.founded = true;
                    console.log(cart)
                    
                }
                if(data.products["error"]){
                    throw {message: products.error}
                }
                setProducts(data)
            }
            catch(error) {
                setProducts({error: error.message})
            }
        }
        getProducts()
        if(products["error"]){
            Swal.fire({
                title:"Error",
                icon:"error",
                text: products.message
            })
        }
    }, [searchParams,user]);
    if(!(Object.keys(products).length === 0) ){
        return (
            <div id="main" className="container-fluid justify-content-center"> 
                <nav className="row" aria-label="...">
                    <ul className="pagination justify-content-center">
                        { products.hasPrevPage?
                            <li className="page-item enable">
                                <a className="page-link" href={products.products.prevLink}>Previous</a>
                            </li>
                            :
                            <li className="page-item disabled">
                                <a className="page-link" href={products.products.prevLink}>Previous</a>
                            </li>
                        }
                        { products.pages.map(page =>
                            {
                                if(page.isCurrentPage){
                                    return(
                                        <li className="page-item active" aria-current="page">
                                            <a className="page-link" href={page.link}>{page.page}</a>
                                        </li>
                                    );
                                }
                                else{
                                    return(

                                        <li className="page-item"><a className="page-link" href={page.link}>{page.page}</a></li>
                                    );
                                }
                            }
                        )}
                        {
                            products.hasNextPage?
                            
                            <li className="page-item enable">
                                <a className="page-link" href={products.products.nextLink}>Next</a>
                            </li>
                            :
                            <li className="page-item disabled">
                                <a className="page-link" href={products.products.nextLink}>Next</a>
                            </li>

                        }
                    </ul>
                    <div className="formButtons">
                        <button id="create" className="btn btn-outline-primary">Crear</button>
                    </div>
                </nav>
                <ItemList products={products.products.payload}/>
            </div>
        );
    }
    else{
        return(
            <div className="row justify-content-center">
                <div className="col-md-12 alert alert-danger" role="alert">No encontramos productos</div>
            </div>
        )
    }
}

export default ItemListContainer;