import React, {useState, useContext, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import Order from "./Order";
import Error from "./errors_&_timeout/Error";
import Swal from "sweetalert2";
import { UserContext } from "./users/UserContext";




function Orders () {
    const {endpoint,server_port} = useContext(UserContext)
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("")
    const params = useParams()
    let orderId = params? params.orderId : null;

    useEffect(() => {
        
        if(orderId){
            getOrders(false).then((result) => {
                setOrders(result)
            })
        }
        else {
            getOrders().then((result) => {
                setOrders(result)
            })
        }
        
    }, [orders]);
    const getOrders = async (all=true) => {
        console.log(endpoint+server_port+'/api/tickets/'+(!all?`${orderId}`:''))
        let requestData = {
            method:"GET",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        let url = endpoint+server_port+'/api/tickets/'+(!all?`${orderId}`:'')
        let request = new Request(url, requestData)
        const result = 
            fetch(request)
            .then( async (response) => {
                if (!response.ok) {
                    const error = await response.json()
                    if(error){
                        Swal.fire({
                            title: error.message,
                            icon: 'error',
                            timer: 2000
                        })
                    }
                    else {
                        Swal.fire({
                            title: `Orden no generada`,
                            icon: 'error',
                            text: 'Ha ocurrido un error inesperado',
                            timer: 2000
                        })
                    }
                    return false
                }
                else {
                    try {
                        
                        const tickets = await response.json()
                        return tickets.payload
                    }
                    catch(error) {
                        Swal.fire({
                            title: error.message,
                            icon:'error'
                        })
                    }
                }
            });
        return result
    }
    if(orders !== null) {
        console.log(typeof orders)
        return(
        
            <div className="row justify-content-center">
                <form className="d-flex" role="search" >
                    <input className="form-control me-2" type="search" placeholder="Buscar" onChange={
                        e => setSearch(e.target.value)
                    } name="search" aria-label="Buscar"/>
                    <Link to={"/orders/"+search} className="btn btn-outline-success" type="submit">Buscar</Link>
                </form>
                {
                    orders.length > 0?
                        orders.map(order =>
                        {
                            return(
                                <div key = {order._id} className={orders.length >= 3?"product col-sm-4 col-md-3":"product col"}>
                                    <Order order={order}></Order>
                                </div>
                            );
                        })
                        :
                        <div id="products" className="container-fluid justify-content-center">
                            <Error status={"wait"} quantity={2}/>
                        </div>
                }
            </div>
        );
    }
    else {
        return(
            <div id="products" className="container-fluid justify-content-center">
                <Error status={"empty"} quantity={2}/>
            </div>
        );
    }

}
export default Orders;