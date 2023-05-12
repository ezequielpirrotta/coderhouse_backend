//import Swal from "sweetalert2";

const socketServer = io()

const products = document.getElementsByClassName("product");
const btn_close_session = document.getElementById("btn_close_session");
const btn_profile = document.getElementById("btn_profile");
const btn_login = document.getElementById("btn_login");
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
    let button = document.getElementById("add_button_"+id)? document.getElementById("add_button_"+id) : null;
    let logged = true;
    if(!button) {
        button = document.getElementById("logedout_add_button_"+id)
        if(button) {
            logged = false;
        } 
    }
    if(button) {
        button.addEventListener("click", async () => {
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
                else {
                    
                }

                /*Swal.fire({
                    title: 'Is this a new Cart?',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    denyButtonText: `No`,
                }).then( async (result) => {
                    if (result.isConfirmed) {
                        
                        
                    } 
                    else if (result.isDenied) {
                        const { value: cart_id } = await Swal.fire({
                            title: 'Enter the cart id',
                            input: 'text',
                            inputLabel: 'ID',
                            inputPlaceholder: 'Ej: 6756d63d3e7632f846cc6a72'
                        })
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
                        let data = {
                            product_id: id,
                            quantity: quantity
                        }
                        socketServer.emit('event_add_product_to_cart', {isNewCart: false, body: data, cart_id: cart_id});
                    }
                });*/
            }
        })
    }
}
socketServer.on('event_adding_cart_error', (data) => {
    Swal.fire({
        title: `Producto no agregado`,
        icon: 'error',
        text: data.detail
    })
})
socketServer.on('event_cart_added', (data) => {
    //console.log("llegueeeee")
    Swal.fire({
        title: 'Producto agregado exitosamente al carrito',
        text: `Este es su ID de carrito: ${data.id}`,
        icon: 'success',
        color: '#716add'
    })
})