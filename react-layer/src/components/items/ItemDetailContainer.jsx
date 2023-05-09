import React, {useState, useEffect, useContext} from "react";
import ItemDetail from "./ItemDetail";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon } from '@primer/octicons-react'
import { CartContext } from "../carts/CartContext";
import { BookmarkFillIcon, BookmarkIcon } from "@primer/octicons-react";
import {doc, getDoc} from "firebase/firestore"; 

function ItemDetailContainer() 
{
    const [product, setProduct] = useState([]);
    const {id} = useParams();
    const { db } = useContext(CartContext);
    
    let document = doc(db, "items", id) 
    useEffect( () => 
    {
        //resolve(products_info.find(product => product.id === parseInt(id)));
        getDoc(document).then((snapshot) => {
            if(snapshot.exists()) {
                setProduct({ id: snapshot.id, ...snapshot.data() })
            }
            else {
                setProduct(null)
            }
        })
     
    },[id]);

    return (
        <div id="product" className="container-fluid justify-content-center">
            <div className="row mt-2 d-flex justify-content-center">
                <div className="col-md-4 justify-content-center">

                    <Link  to={`/`} >
                        <button className="btn-primary" >
                            <ArrowLeftIcon size={24} />
                        </button>
                    </Link>
                </div>
            </div>
            <ItemDetail product={product}/>
        </div>
    );
}

export default ItemDetailContainer;