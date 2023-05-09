import React, {useState, useContext, useEffect} from "react";
import {query, collection, where, getDocs, getDoc, doc} from "firebase/firestore";
import { CartContext } from "./carts/CartContext";
import { Link, useParams } from "react-router-dom";
import Order from "./Order";
import Error from "./errors_&_timeout/Error";


function Orders () {
    // 'from' puede contener valor(integer) 1 o 2 segun si viene de 'checkout' o de 'profile'
    const {db} = useContext(CartContext);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("")
    const params = useParams()
    let orderId = params? params.orderId : null;
    console.log(orderId)

    useEffect(() => {
        
        //const col = ordersCollection;
        
        try {
            if(orderId ){
                const documento = doc(db, "orders", orderId);
                getDoc(documento).then((snapShot) => {
                    if (snapShot.exists()) {
                        setOrders([{id:snapShot.id, ...snapShot.data()}]);
                        console.log(orders)
                    } else {
                        console.log("Error! No se encontró el Documento!");
                    }
                });
            }
            else {

                const ordersCollection = collection(db, "orders");
                //const col = orderId? query(ordersCollection, where("id", "==", orderId)) : ordersCollection;
                getDocs(ordersCollection).then((snapshot) => {
                    
                    let result = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
                    console.log(result)
                    
                    if(!Array.isArray(result) || result.length <= 0) {
    
                        setOrders(null);
                    }
                    else {
                        result = result.filter((element) => {
                            if(Object.values(element).includes("test")){
                                return false;
                            }
                            return true;
                        })
                        setOrders(result);
                        
                    }
                    /*if(orderId) {
                        result = result.filter((element) => {
                            if(Object.values(element).includes(orderId)){
                                return true;
                            }
                            return false;
                        })
                        setOrders(result)
                    }*/
                });
            }
            
        }
        catch(e) {
            console.log(e)
        }
        
    }, []);
    
    if(orders !== null){
        if(orders.length > 0){
            console.log(orders);
            return (
                <div className="row justify-content-center">
                    <form className="d-flex" role="search" >
                        <input className="form-control me-2" type="search" placeholder="Buscar" onChange={
                            e => setSearch(e.target.value)
                        } name="search" aria-label="Buscar"/>
                        <Link to={"/orders/"+search} className="btn btn-outline-success" type="submit">Buscar</Link>
                    </form>
                    {
                        orders.map(order =>
                        {
                            return(
                                <div key = {order.id} className={orders.length >= 3?"product col-sm-4 col-md-3":"product col"}>
                                    <Order order={order}></Order>
                                </div>
                            );
                        })
                    }
                    
                </div>
            );
        }
        else {
            return(
                <div id="products" className="container-fluid justify-content-center">
                    <Error status={"wait"} quantity={2}/>
                </div>
            )  
        }
    }
    
    else
    {
        return(
            <div id="products" className="container-fluid justify-content-center">
                <Error status={"empty"} quantity={2}/>
            </div>
        );
    }

}
export default Orders;