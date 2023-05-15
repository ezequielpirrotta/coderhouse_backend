//import Swal from "sweetalert2";
//require('dotenv').config()
//import config from 'dotenv/config';
//console.log(process.env.PORT)
const socketServer = io()
const products = document.getElementsByClassName("product");
/**Buttons */
const btn_close_session = document.getElementById("btn_close_session");
const btn_profile = document.getElementById("btn_profile");
const btn_login = document.getElementById("btn_login");
const btn_create = document.getElementById("create")
/**********/
const navBarList = document.getElementById("navBarList");

if(btn_close_session) {

    btn_close_session.addEventListener("click", async () => {
        Swal.fire({
            title: 'Are you sure you want to exit?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then( async (result) => {
            if (result.isConfirmed) {
                const result = await fetch('/api/sessions/logout').then((response)=>response.json())
                if(!result.error){
                    window.location.replace('/');
                }
                else {
                    Swal.fire({
                        title:"Error",
                        icon:"error",
                        text: result.message
                    })
                }
                socketServer.emit('event_logout_user');
                window.location.replace('/users/login');
            }
        })
    });
}

if(btn_profile) {
    btn_profile.addEventListener("click", async () => {
        window.location.replace('/users');    
    });
}
if(btn_login) {
    btn_login.addEventListener("click", async () => {
        window.location.replace('/users/login');    
    });
}
for(let i=0; i < products.length;i++) {
    let id = products[i].id;
    let add_button = document.getElementById("add_button_"+id)? document.getElementById("add_button_"+id) : null;
    let edit_button = document.getElementById("edit_button_"+id)? document.getElementById("edit_button_"+id) : null;
    let logged = true;
    if(!add_button || !edit_button) {
        add_button = document.getElementById("logedout_add_button_"+id)
        edit_button = document.getElementById("logedout_edit_button_"+id)
        console.log(edit_button) 
        if(add_button || edit_button) {
            logged = false;
        } 
    }
    if(add_button) {
        add_button.addEventListener("click", async () => {
            if(!logged) {
                Swal.fire({
                    title: 'Debes estar loggeado para poder crear un carrito',
                    showDenyButton: true,
                    confirmButtonText: 'Iniciar sesion',
                    denyButtonText: `No`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace('/users/login');
                    }
                })
            }
            else {
                const cookieValue = document.cookie
                .split('; ')
                .find(cookie => cookie.startsWith('cartCookie='));
                console.log(cookieValue)
                if (cookieValue) {
                    // Extract the value from the cookie string
                    //const [, value] = cookieValue.split('=');
                    //console.log(`Cookie value: ${JSON.parse(value)}`);
                    const { value: quantity } = await Swal.fire({
                        title: 'How many products?',
                        icon: 'question',
                        input: 'range',
                        inputLabel: 'Cantidad de productos',
                        showCancelButton: true,
                        inputAttributes: {
                            min: 1,
                            max: parseInt(document.getElementById("stock_"+id).innerHTML),
                            step: 1
                        },
                        inputValue: 1
                    })
                    if (quantity) {
                        let cart = {
                            product: id,
                            quantity: quantity
                            
                        }
                        socketServer.emit('event_add_product_to_cart', {isNewCart: true, cart: cart});
                    }
                } 
            }
        })
    }
    if(edit_button) {
        
        edit_button.addEventListener("click", async () => {
            if(!logged) {
                Swal.fire({
                    title: 'Debes estar loggeado para poder editar el producto',
                    showDenyButton: true,
                    confirmButtonText: 'Iniciar sesion',
                    denyButtonText: `No`,
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.replace('/users/login');
                    }
                })
            }
            else {
                const cookieValue = document.cookie
                .split('; ')
                .find(cookie => cookie.startsWith('cartCookie='));
                console.log(cookieValue)
                if (cookieValue) {
                    // Extract the value from the cookie string
                    //const [, value] = cookieValue.split('=');
                    //console.log(`Cookie value: ${JSON.parse(value)}`);
                    const { value: field } = await Swal.fire({
                        title: 'Select a field',
                        input: 'select',
                        inputLabel: 'Field',
                        inputOptions: {
                            price: 'price',
                            title: 'title',
                            description: 'description',
                            stock: 'stock'
                        },
                        inputPlaceholder: 'Select an attribute',
                        inputAttributes: {
                            maxlength: 10,
                            autocapitalize: 'off',
                            autocorrect: 'off'
                        }
                    })
                    const { value: newValue } = await Swal.fire({
                        title: "Enter a new value",
                        input: 'text',
                        inputLabel: 'New Value',
                        inputAttributes: {
                            'aria-label': 'Type your message here'
                        },
                        inputValidator: (value) =>{
                            if (!value){
                                return "Debes ingresar un valor."
                            }
                        }
                    })
                    if (newValue && field && id) {
                        let change = {
                            field: field,
                            newValue: newValue
                        }
                        let requestData = {
                            method:"PUT",
                            body: JSON.stringify(change),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            }
                        }
                        let request = new Request('http://localhost:8080'+'/api/products/'+parseInt(id), requestData) 
                        let result = await fetch(request)
                        .then( (response) => response.json());
                        if(result.status === "WRONG") {
                            Swal.fire({
                                title: `Producto ${id} no actualizado`,
                                description: result.detail
                            })
                        }
                        else {
                            Swal.fire({
                                title: `Producto ${id} actualizado exitosamente`,
                                color: '#716add'
                            })
                        }
                        const data = {
                            id: parseInt(id),
                            field: field,
                            newValue: newValue
                        }
                        
                    }
                    const { value: quantity } = await Swal.fire({
                        title: 'How many products?',
                        icon: 'question',
                        input: 'range',
                        inputLabel: 'Cantidad de productos',
                        showCancelButton: true,
                        inputAttributes: {
                            min: 1,
                            max: parseInt(document.getElementById("stock_"+id).innerHTML),
                            step: 1
                        },
                        inputValue: 1
                    })
                    if (quantity) {
                        let cart = {
                            product: id,
                            quantity: quantity
                            
                        }
                        socketServer.emit('event_add_product_to_cart', {isNewCart: true, cart: cart});
                    }
                } 
            }
        })
    }
}
btnCreate.addEventListener("click", async () => {
    
    const { value: title } = await Swal.fire({
        title: 'Ingrese un título',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    })
    const { value: description } = await Swal.fire({
        title: 'Ingrese una descripción',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    })
    const { value: price } = await Swal.fire({
        title: 'Ingrese un precio',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    })
    const { value: code } = await Swal.fire({
        title: 'Ingrese un código',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    })
    const { value: stock } = await Swal.fire({
        title: 'Ingrese una cantidad de stock',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    })
    const { value: category } = await Swal.fire({
        title: 'Ingrese una categoría',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    })
    const { value: thumbnail } = await Swal.fire({
        title: 'Ingrese una imagen',
        input: 'text',
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!'
            }
        }
    })
    if (title&&description&&price&&code&&stock&&category&&thumbnail) {
        let product = {
            title: title,
            description: description,
            price: parseInt(price),
            code: code,
            stock: parseInt(stock),
            category: category,
            thumbnail: thumbnail
        }
        let requestData = {
            method:"POST",
            body: JSON.stringify(product),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        let request = new Request(endpoint+'/api/products/'+data.id, requestData) 
        let result = await fetch(request)
        .then( (response) => response.json());
        if(result.status === "WRONG") {
            Swal.fire({
                title: `Producto ${data.id} no creado`,
                description: result.detail
            })
        }
        else if(result === "Unauthorized"){
            Swal.fire({
                title: `No tienes permisos para editar`,
            })
        }
        else {
            Swal.fire({
                title: `Producto ${data.id} creado exitosamente`,
                color: '#716add'
            })
        }
    }
})
/** Handling events **/
socketServer.on('event_adding_cart_error', (data) => {
    Swal.fire({
        title: `Producto no agregado`,
        icon: 'error',
        text: data.detail
    })
})
socketServer.on('event_cart_added', (data) => {
    Swal.fire({
        title: 'Producto agregado exitosamente al carrito',
        text: `Este es su ID de carrito: ${data.id}`,
        icon: 'success',
        color: '#716add'
    })
})