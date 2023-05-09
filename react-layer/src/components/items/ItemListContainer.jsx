import React, { useState , useEffect, useContext} from "react";
import ItemList from "./ItemList";
import { useParams } from "react-router-dom";
import { CartContext } from "../carts/CartContext";
import {query, collection, where, getDocs} from "firebase/firestore";

function ItemListContainer() 
{
    const [products, setProducts] = useState([]);
    const {cat} = useParams();
    const { db } = useContext(CartContext);
    useEffect(() => {
        const itemsCollection = collection(db, "items");
        const col = cat ? query(itemsCollection, where("type", "==", cat)) : itemsCollection;
      
        try {
            getDocs(col).then((snapshot) => {
                
                let result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
                setProducts(result);
    
                if(!Array.isArray(result) || result.length <= 0) {
                    setProducts(null);
                }
            });
        }
        catch(e) {
            console.log(e)
        }
        
    }, [cat]);
    return (
        <div id="products" className="container-fluid justify-content-center">
            <ItemList products={products}/>
        </div>
    );
}

export default ItemListContainer;