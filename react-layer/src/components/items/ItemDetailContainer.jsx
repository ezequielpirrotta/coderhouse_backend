import React, {useState, useEffect, useContext} from "react";
import ItemDetail from "./ItemDetail";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon } from '@primer/octicons-react'
import { CartContext } from "../carts/CartContext";
import { BookmarkFillIcon, BookmarkIcon } from "@primer/octicons-react";

const port = '3000';
const server_port = '8080';
const endpoint = 'http://localhost:';
function ItemDetailContainer() 
{
    const [product, setProduct] = useState([]);
    const {id} = useParams();
    
    useEffect( () => 
    {
        const getProduct = async () => {
            let result = await fetch(endpoint+server_port+'/api/products/'+id,{credentials:"include"})
                .then( (response) => response.json());
            setProduct(result)
        }
        getProduct()
     
    },[]);

    return (
        <div id="product" className="container-fluid justify-content-center">
            <div className="row mt-2 d-flex justify-content-center">
                <div className="col-md-4 justify-content-start">
                    <Link to={`/products`} className="btn-primary">
                        <ArrowLeftIcon size={24} />
                    </Link>
                </div>
            </div>
            <ItemDetail product={product}/>
        </div>
    );
}

export default ItemDetailContainer;