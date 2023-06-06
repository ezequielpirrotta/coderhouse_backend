import React, { useState , useEffect, useContext} from "react";
import ItemList from "./ItemList";
import FilterNavbar from "../nav/FilterNavbar";
import {useSearchParams } from "react-router-dom";
//import { CartContext } from "../carts/CartContext";
import Swal from 'sweetalert2';
import { UserContext } from "../users/UserContext";
import {MDBContainer,MDBPagination,MDBPaginationLink,MDBPaginationItem,MDBBtnGroup,MDBBtn,MDBRow, MDBCol} from "mdb-react-ui-kit"

const port = '3000';
const server_port = '8080';
const endpoint = 'http://localhost:';

function ItemListContainer() 
{
    const {user} = useContext(UserContext)
    const [products, setProducts] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    //console.log(searchParams.get("category"))
    
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
                let filters = [];
                if(limit||page||sort||category||available) {
                    
                    params = params+'?'
                    
                    if(limit) {
                        params = params.length>1? params+'&limit='+limit : params+'limit='+limit
                        filters.push(limit)
                    }
                    else if(page) {
                        params = params.length>1? params+'&page='+page : params+'page='+page
                        filters.push(page)
                    }
                    else if(sort) {
                        params = params.length>1? params+'&sort='+sort : params+'sort='+sort
                        filters.push(sort)
                    }
                    else if(category) {
                        params = params.length>1? params+'&category='+category : params+'category='+category
                        filters.push(category)
                    }
                    else if(available) {
                        params = params.length>1? params+'&available='+available : params+'available='+available
                        filters.push(available)
                    }
                    
                } 
                data.products = await fetch(endpoint+server_port+'/api/products'+params,{credentials:"include"})
                .then( (response) => response.json());
                if(data.products.status === "WRONG" || data.products.error){
                    data.founded = false;
                }
                else {
                    
                    data.token = user
                    data.products.prevLink = data.products.hasPrevPage? `${endpoint+port}/products?page=${data.products.prevPage}`:'';
    
                    data.products.nextLink = data.products.hasNextPage? `${endpoint+port}/products?page=${data.products.nextPage}`:'';
                    for (const key in filters) {
                        if(key !== "page"){
                            let result = params.search(key);
                            data.products.prevLink = result >= 0? data.products.prevLink+'&'+key+'='+filters[key] : data.products.prevLink;
                            data.products.nextLink = result >= 0? data.products.nextLink+'&'+key+'='+filters[key] : data.products.nextLink;
                        }
                    }
                    data.pages = []
                    for (let i = 0; i < data.products.totalPages; i++) {
                        data.pages[i] = {
                            page: i+1,
                            isCurrentPage: data.products.page === i+1? true:false,
                            link: `/products?page=${i+1}`
                        };
                        for (const key in filters) {
                            if(key !== "page"){
                                let result = params.search(key);
                                data.pages[i].link = result >= 0? data.pages[i].link+'&'+key+'='+filters[key] : data.pages[i].link; 
                            }
                        }
                    }
                    data.founded = true;
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
            <MDBContainer fluid className="py-5 container-fluid justify-content-center" style={{ backgroundColor: "transparent" }}>
                
                <nav aria-label='Page navigation example'>
                    <MDBPagination className='mb-0 justify-content-center'>
                    <MDBPaginationItem className={products.hasPrevPage?"enable":"disabled"}>
                        <MDBPaginationLink href={products.products.prevLink} aria-label='Previous'>
                            <span aria-hidden='true'>Previous</span>
                        </MDBPaginationLink>
                    </MDBPaginationItem>
                    { products.pages.map(page =>
                            {
                                if(page.isCurrentPage){
                                    return(
                                        <MDBPaginationItem className="active" aria-current="page">
                                            <MDBPaginationLink href={page.link}>{page.page}</MDBPaginationLink>
                                        </MDBPaginationItem>
                                    );
                                }
                                else{
                                    return(

                                        <MDBPaginationItem className="active">
                                            <MDBPaginationLink href={page.link}>{page.page}</MDBPaginationLink>
                                        </MDBPaginationItem>
                                    );
                                }
                            }
                    )}
                    <MDBPaginationItem className={products.hasNextPage?"enable":"disabled"}>
                        <MDBPaginationLink href={products.products.nextLink} aria-label='Next'>
                            <span aria-hidden='true'>Next</span>
                        </MDBPaginationLink>
                    </MDBPaginationItem>
                    </MDBPagination>
                </nav>
                <MDBRow >
                    <MDBCol className="justify-content-center">
                        <MDBBtnGroup aria-label='Basic example'>
                            <MDBBtn>Crear</MDBBtn>
                        </MDBBtnGroup>

                    </MDBCol>
                </MDBRow>
                <ItemList products={products.products.payload}/>
            </MDBContainer>
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
/**
 * <div id="main" className="container-fluid justify-content-center"> 
    </div>
 * 
 */