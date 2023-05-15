import React, { useState , useEffect, useContext} from "react";
import ItemList from "./ItemList";
import { useParams } from "react-router-dom";
import { CartContext } from "../carts/CartContext";
import Swal from 'sweetalert2';

const port = '3000';
const endpoint = 'http://localhost:';

function ItemListContainer() 
{
    const [products, setProducts] = useState([]);
    const {cat} = useParams();
    const getProducts = async () => {
        let result = await fetch(endpoint+port+'/api/products/').then((response)=>response.json())
        console.log(result);
        return result
    }
    useEffect(  () => {
        try {
            console.log(process.env)
            let result = getProducts()
            if(!result.error){

                //setProducts()
            }
            else {
                Swal.fire({
                    title:"Error",
                    icon:"error",
                    text: result.message
                })
            }
            //socketServer.emit('event_logout_user');
            //window.location.replace('/users/login');
            /*etDocs(col).then((snapshot) => {
                
                let result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
                setProducts(result);
    
                if(!Array.isArray(result) || result.length <= 0) {
                    setProducts(null);
                }
            });*/
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
        <div id="products" className="container-fluid justify-content-center">
            <ItemList products={products}/>
        </div>
    );
}

export default ItemListContainer;