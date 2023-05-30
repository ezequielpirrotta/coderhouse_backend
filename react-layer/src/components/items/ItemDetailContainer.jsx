import React, {useState, useEffect, useContext} from "react";
import ItemDetail from "./ItemDetail";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon } from '@primer/octicons-react'
import { CartContext } from "../carts/CartContext";
import { BookmarkFillIcon, BookmarkIcon } from "@primer/octicons-react";

const endpoint = process.env.ENDPOINT;
const port = process.env.SERVER_PORT;

function ItemDetailContainer() 
{
    const [product, setProduct] = useState([]);
    const {id} = useParams();
    
    //let document = doc(db, "items", id) 
    useEffect( () => 
    {
        
        //resolve(products_info.find(product => product.id === parseInt(id)));
        /*getDoc(document).then((snapshot) => {
            if(snapshot.exists()) {
                setProduct({ id: snapshot.id, ...snapshot.data() })
            }
            else {
                setProduct(null)
            }
        })*/
     
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