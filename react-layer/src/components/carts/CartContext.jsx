import React from "react";
import { useState, createContext } from "react";
import {getFirestore} from "firebase/firestore";
import { useEffect } from "react";

export const CartContext = createContext();

function CartContextProvider({children}) {

    const db = getFirestore();
    const [cart, setCart] = useState([]);
   
    useEffect(() => {
        
        let sessionCart = window.localStorage.getItem("cart");
        if(totalCart() === 0 || !sessionCart){

            if(totalCart() === 0 && sessionCart){
                setCart(JSON.parse(sessionCart));
            }
            else if(totalCart() > 0 && !sessionCart) {
                window.localStorage.setItem("cart", JSON.stringify(cart))
            }
            
        }
    },[])

    
    const addItem = (item, quantity) => {
        if(isInCart(item.id)) {
            let pos = cart.findIndex(element => element.id === item.id);
            cart[pos].quantity += quantity;
            setCart([...cart]);
            window.localStorage.setItem("cart",JSON.stringify([...cart]))
        }
        else {
            setCart([...cart, {...item, quantity: quantity}]);
            localStorage.setItem("cart",JSON.stringify([...cart, {...item, quantity: quantity}]))
        }
    }
    const removeItem = (itemId) => {
        //console.log(cart.filter(element => element.id !== itemId))
        setCart(cart.filter(element => element.id !== itemId));
    }
    const clearCart = () => {
        setCart([]);
        window.localStorage.clear();
    }
    const isInCart = (id) => {
        return (cart.some(item => item.id === id));
    }

    const totalCart = () => {
        if(cart.length >= 0) {
            return cart.reduce((total, item) => total += item.quantity, 0);
        }
        return 0;
    }
    const totalPrice = () => {
        return cart.reduce((total, item) => total += item.quantity * item.price, 0);
    }
    
    
    
    return(
        <CartContext.Provider 
            value={{
                cart,
                db,
                addItem,
                removeItem,
                clearCart,
                totalCart,
                totalPrice
            }}>
            {children}
        </CartContext.Provider>
    );
}
export default CartContextProvider;