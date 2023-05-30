import React from "react";
import { useState, createContext } from "react";
import { useEffect } from "react";
import Cookies from 'universal-cookie';

export const CartContext = createContext();

const cookies = new Cookies();

function CartContextProvider({children}) {

    const [cart, setCart] = useState([]);
    
    useEffect(() => {
        
        if(totalCart() === 0){
            let cookieCart = cookies.get("cartCookie")
            if(cookieCart){
                setCart(cookieCart)
            }
        }
    },[])

    
    const addItem = (item, quantity) => {
        if(isInCart(item.id)) {
            let pos = cart.findIndex(element => element.id === item.id);
            cart[pos].quantity += quantity;
            setCart([...cart]);
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
        /*if(cart) {
            let total = 0;
            cart.products.forEach(element => {
                console.log(element)
                total += element.quantity    
            }); 
        }*/
        if(cart){
            if(cart.length > 0) {
                console.log(cart)
                return cart.products.reduce((total, item) => total += item.quantity, 0);
            }
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