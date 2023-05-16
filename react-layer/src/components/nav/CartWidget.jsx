import React from "react";
import { useContext } from "react";
import { CartContext } from "../carts/CartContext";
import { Link } from "react-router-dom";

function CartWidget() {
    const {totalCart} = useContext(CartContext);
    
    return (
        <Link to={"/cart"}>
            <button type="button" className="btn position-relative">
                <img src={"/img/cart2.svg"} alt={"Carrito"} width={25}/>
                { totalCart() > 0 ?
                    <span id="cart_items" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {totalCart()} 
                    </span>
                    : null
                }   
            </button>
        </Link>
    );
}
export default CartWidget;