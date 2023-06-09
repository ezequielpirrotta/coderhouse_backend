import React, { useState , useEffect, useContext} from "react";
import ItemList from "./ItemList";
import FilterNavbar from "../nav/FilterNavbar";
import {useSearchParams } from "react-router-dom";
//import { CartContext } from "../carts/CartContext";
import Swal from 'sweetalert2';
import { UserContext } from "../users/UserContext";
import {MDBContainer,MDBPagination,MDBPaginationLink,MDBPaginationItem,MDBBtnGroup,MDBBtn,MDBRow, MDBCol} from "mdb-react-ui-kit"

const server_port = '8080';
const endpoint = 'http://localhost:';

function ItemListContainer() 
{
    const {user} = useContext(UserContext)
    const [products, setProducts] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    
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
                        filters["limit"] = limit
                    }
                    if(page) {
                        params = params.length>1? params+'&page='+page : params+'page='+page
                        filters["page"] = page
                    }
                    if(sort) {
                        params = params.length>1? params+'&sort='+sort : params+'sort='+sort
                        filters["sort"] = sort
                    }
                    if(category) {
                        console.log("categoría")
                        params = params.length>1? params+'&category='+category : params+'category='+category
                        filters["category"] = category
                    }
                    else if(available) {
                        params = params.length>1? params+'&available='+available : params+'available='+available
                        filters["available"] = available
                    }
                    
                } 
                data.products = await fetch(endpoint+server_port+'/api/products'+params,{credentials:"include"})
                .then( (response) => response.json());
                if(data.products.status === "WRONG" || data.products.error){
                    data.founded = false;
                }
                else {
                    
                    data.token = user
                    console.log(data.products)
                    
                    data.products.prevLink = data.products.hasPrevPage? `/products?page=${data.products.prevPage}`:null;
    
                    data.products.nextLink = data.products.hasNextPage? `/products?page=${data.products.nextPage}`:null;
                    for (const key in filters) {
                        console.log(data.products.nextLink)
                        if(key !== "page"){
                            let result = params.search(key);
                            data.products.prevLink = result >= 0? data.products.prevLink+'&'+key+'='+filters[key] : data.products.prevLink;
                            data.products.nextLink = result >= 0? data.products.nextLink+'&'+key+'='+filters[key] : data.products.nextLink;
                        }
                    }
                    data.pages = []
                    for (let i = 1; i <= data.products.totalPages; i++) {
                        console.log(i)
                        data.pages[i] = {
                            page: i,
                            isCurrentPage: data.products.page === i? true:false,
                            link: `/products?page=${i+1}`
                        };
                        console.log(data.pages[i].link)
                        
                        for (const key in filters) {
                            if(key !== "page"){
                                console.log(key)
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
                console.log(data)
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
    const createProduct = async() => {
        Swal.fire({
            title: 'Create Product',
            html:  `
                    <div>
                        <input type="text" id="title" class="swal2-input" placeholder="title">
                        <input type="number" id="price" class="swal2-input" placeholder="price">
                        <input type="text" id="description" class="swal2-input" placeholder="description">
                        <select id="category" class="swal2-input" aria-label="Default select example">
                            <option selected value="comida">Comida</option>
                            <option value="ropa">Ropa</option>
                            <option value="otros">Otros</option>
                        </select>
                        <input type="number" id="stock" class="swal2-input" placeholder="stock">
                        <input type="text" id="image" class="swal2-input" placeholder="image">
                    </div>`,
            confirmButtonText: 'Create',
            focusConfirm: false,
            preConfirm: () => {
              const title = Swal.getPopup().querySelector('#title').value
              const price = Swal.getPopup().querySelector('#price').value
              const description = Swal.getPopup().querySelector('#description').value
              const category = Swal.getPopup().querySelector('#category').value
              const stock = Swal.getPopup().querySelector('#stock').value
              const image = Swal.getPopup().querySelector('#image').value

              if (!price || !description || !title || !category || !stock || !image) {
                Swal.showValidationMessage(`Please complete all the fields`)
              }
              return { price: price, description: description, title: title, category:category, stock:stock, image:image}
            }
        }).then((result) => {
            
            let data = {
                price: parseInt(result.value.price), 
                description: result.value.description, 
                title: result.value.title,
                category: result.value.category,
                stock: parseInt(result.value.stock),
                thumbnail: result.value.image
            }
            
            let requestData = {
                method:"POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include'
            }
            const request = new Request(endpoint+server_port+'/api/products/', requestData)
            fetch(request)
            .then( async (response) => {
                
                if (!response.ok) {
                    const error = await response.json()
                    if(error.status === "WRONG") {
                        Swal.fire({
                            title: `Producto no creado`,
                            text: error.message
                        })
                    }
                    else if(error.code === "Unauthorized"){
                        Swal.fire({
                            title: `No tienes permisos para crear`,
                        })
                    }
                } 
                else {
                    const data = await response.json()
                    Swal.fire({
                        title: `Producto ${data._id} creado exitosamente`,
                        color: '#716add'
                    })
                }
            })
        })
    }
    if(!(Object.keys(products).length === 0) ){
        return (
            <MDBContainer fluid className="py-5 container-fluid justify-content-center" style={{ backgroundColor: "transparent" }}>
                <nav aria-label='Page navigation example'>
                    <MDBPagination className='mb-0 justify-content-center'>
                    <MDBPaginationItem className={products.products.hasPrevPage?"enable":"disabled"}>
                        <MDBPaginationLink href={products.products.prevLink} aria-label='Previous'>
                            <span aria-hidden='true'>Previous</span>
                        </MDBPaginationLink>
                    </MDBPaginationItem>
                    { products.pages.map(page =>
                            {
                                if(page.isCurrentPage){
                                    return(
                                        <MDBPaginationItem className="disabled" aria-current="page">
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
                    <MDBPaginationItem className={products.products.hasNextPage?"enable":"disabled"}>
                        <MDBPaginationLink href={products.products.nextLink} aria-label='Next'>
                            <span aria-hidden='true'>Next</span>
                        </MDBPaginationLink>
                    </MDBPaginationItem>
                    </MDBPagination>
                </nav>
                {
                    user?
                        user.role === "admin" || user.role === "premium"?
                        <MDBRow >
                            <MDBCol className="justify-content-center">
                                <MDBBtnGroup aria-label='Basic example'>
                                    <MDBBtn onClick={createProduct}>Crear</MDBBtn>
                                </MDBBtnGroup>

                            </MDBCol>
                        </MDBRow>
                        :null
                    :null
                }
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