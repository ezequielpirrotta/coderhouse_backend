import React from "react";
import { useState, createContext } from "react";
import { useEffect } from "react";
import Cookies from 'universal-cookie';
import { useContext } from "react";
import { UserContext } from "../users/UserContext";
import Swal from "sweetalert2";

export const CartContext = createContext();
const server_port = '8080';
const endpoint = 'http://localhost:';
const cookies = new Cookies();

function CartContextProvider({children}) {
    const { user } = useContext(UserContext);
    const [cookieCart,setCookieCart] = useState(cookies.get("cartCookie"))
    const [cart, setCart] = useState({});
    
    useEffect(() => {
        
        if(totalCart() === 0){
            if(cookieCart){
                console.log("setié el carrito")
                console.log(cookieCart)
                setCart(cookieCart)
            }
        }
    },[cart])
    const getCartCookie = () => {
        let requestData = {
            method:"GET",
            body: JSON.stringify({name:'cartCookie'}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        let request = new Request(endpoint+server_port+'/cookies/getCookie', requestData)
        fetch(request).then( (response) => response.json());
    }
    const updateCartCookie = (value) => {
        let requestData = {
            method:"POST",
            body: JSON.stringify({cookieValue: value ,cookieName:'cartCookie',cookieTime:24*60*60*1000}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        let request = new Request(endpoint+server_port+'/cookies/setCookie', requestData)
        fetch(request).then( (response) => response.json());

    }
    const addItem = async (item, quantity) => {
        if(isInCart(item._id)) {
            let pos = cart.products.findIndex(element => element.product._id === item._id);
            cart.products[pos].quantity += quantity;
            let requestData = {
                method:"PUT",
                body: JSON.stringify({quantity: quantity}),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include'
            }
            let request = new Request(endpoint+server_port+'/api/carts/'+user.cart+'/product/'+item._id, requestData)
           
            fetch(request)
            .then( async (response) => {
                if (!response.ok) {
                    const error = await response.json()
                    if(error){
                        Swal.fire({
                            title: error.message,
                            icon: 'error',
                        })
                    }
                    else {
                        Swal.fire({
                            title: `No se pudo añadir al carrito`,
                            icon: 'error',
                            text: 'Ha ocurrido un error inesperado'
                        })
                    }
                }
                else {
                    const updatedCart = await getCart()
                    setCart(updatedCart);
                    console.log(cookieCart)
                    updateCartCookie(cart)
                    console.log(cookieCart)
                    cookies.set("cartCookie",cart,{path:"/"})
                }
            })
        }
        else {
            let requestData = {
                method:"PUT",
                body: JSON.stringify({product_id: item._id, quantity: quantity}),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include'
            }
            let request = new Request(endpoint+server_port+'/api/carts/'+user.cart+'/product/', requestData)
           
            return await fetch(request)
            .then( async (response) => {
                if (!response.ok) {
                    const error = await response.json()
                    if(error){
                        Swal.fire({
                            title: error.message,
                            icon: 'error',
                        })
                        return false;
                    }
                    else {
                        Swal.fire({
                            title: `No se pudo añadir al carrito`,
                            icon: 'error',
                            text: 'Ha ocurrido un error inesperado'
                        })
                        return false;
                    }
                }
                else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Haz añadido '+quantity+' items a tu carrito',
                        showConfirmButton: false,
                        timer: 2000
                    })
                    const updatedCart = await getCart()
                    setCart(updatedCart);
                    updateCartCookie(cart)
                    cookies.set("cartCookie",cart,{path:"/"})
                    return true;
                }
            })
        }
    }
    const removeItem = async (itemId) => {
        let requestData = {
            method:"DELETE",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        let request = new Request(endpoint+server_port+'/api/carts/'+user.cart+'/products/'+itemId, requestData)
       
        fetch(request)
        .then( async (response) => {
            if (!response.ok) {
                const error = await response.json()
                if(error){
                    Swal.fire({
                        title: error.message,
                        icon: 'error',
                    })
                }
                else {
                    Swal.fire({
                        title: `No se pudo eliminar el producto del carrito`,
                        icon: 'error',
                        text: 'Ha ocurrido un error inesperado'
                    })
                }
            }
            else {
                const updatedCart = await getCart()
                setCart(updatedCart);
                console.log(cookieCart)
                updateCartCookie(cart)
                console.log(cookieCart)
                cookies.set("cartCookie",cart,{path:"/"})
            }
        })
    }
    const clearCart = () => {
        
        let requestData = {
            method:"DELETE",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        let request = new Request(endpoint+server_port+'/api/carts/'+user.cart, requestData)
       
        fetch(request)
        .then( async (response) => {
            if (!response.ok) {
                const error = await response.json()
                if(error){
                    Swal.fire({
                        title: error.message,
                        icon: 'error',
                    })
                }
                else {
                    Swal.fire({
                        title: `Carrito no eliminado`,
                        icon: 'error',
                        text: 'Ha ocurrido un error inesperado'
                    })
                }
            }
            else {
                const updatedCart = await getCart()
                setCart(updatedCart);
                console.log(cookieCart)
                updateCartCookie(cart)
                console.log(cookieCart)
                cookies.set("cartCookie",cart,{path:"/"})
            }
        })
    }
    const purchaseCart = async () => {
        let requestData = {
            method:"POST",
            body: JSON.stringify({username: user.username}),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        let request = new Request(endpoint+server_port+'/api/carts/'+user.cart+'/purchase', requestData)
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
                    console.log(await response.json())
                    let title = "Pedido exitoso!!"
                    let message = "Muchas gracias por confiar en nosotros para tu compra!"
                    let requestData = {
                        method:"POST",
                        body: JSON.stringify({email: user.username, message: message, title: title}),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        },
                        credentials: 'include'
                    }
                    let request = new Request(endpoint+server_port+'/api/mail/', requestData)
                    fetch(request)
                    const updatedCart = await getCart()
                    setCart(updatedCart);
                    updateCartCookie(cart)
                    cookies.set("cartCookie",cart,{path:"/"})
                    return true
                }
            });
        return result
    }
    const isInCart = (id) => {
        return (cart.products.some(item => item._id === id));
    }
    const getCart = async () => {
        let requestData = {
            method:"GET",
            body: JSON.stringify(),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include'
        }
        let request = new Request(endpoint+server_port+'/api/carts/'+user.cart, requestData)
        let cart = await fetch(request).then( (response) => response.json());
        return cart;
    } 
    const totalCart = () => {
        if(cart["products"]){
            if(cart.products.length > 0) {
                return cart.products.reduce((total, item) => total += item.quantity, 0);
            }
        }
        return 0;
    }
    const totalPrice = () => {
        console.log(cart)
        return cart.products.reduce((total, item) => total += item.quantity * item.product.price, 0);
    }
    
    return(
        <CartContext.Provider 
            value={{
                cart,
                addItem,
                removeItem,
                clearCart,
                totalCart,
                totalPrice,
                purchaseCart,
                getCart
            }}>
            {children}
        </CartContext.Provider>
    );
}
export default CartContextProvider;