import React, {useContext}from "react";
import { Link } from "react-router-dom";
import Error from "../errors_&_timeout/Error";
import { CartContext } from "./CartContext";
import CartContent from "./CartContent";
//import { useEffect } from "react";


function Cart () {

    const {totalCart} = useContext(CartContext);
    
    if(totalCart() === 0){

        return(
            <div className="container-fluid justify-content-center">
                <Error status={"empty"} quantity={2} /> 
                <div className="row justify-content-center ">
                    <div className="col-md-12 align-middle">
                        <Link to={"/"} className="btn btn-primary">Volver al inicio</Link>
                    </div>
                </div>
            </div>
        );
        
    }
    return( <CartContent/> );
}
export default Cart;