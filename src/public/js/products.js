//import Swal from "sweetalert2";

const socketServer = io()

const products = document.getElementsByClassName("product");

for(let i=0; i < products.length;i++) {
    let id = products[i].id;
    let button = document.getElementById("add_button_"+id)
    button.addEventListener("click", async () => {

        const { value: quantity } = await Swal.fire({
            title: 'How old are you?',
            icon: 'question',
            input: 'range',
            inputLabel: 'Cantidad de productos',
            inputAttributes: {
              min: 1,
              max: parseInt(document.getElementById("stock_"+id).innerHTML),
              step: 1
            },
            inputValue: 1
        })
        Swal.fire({
            title: 'Is this a new Cart?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then( async (result) => {
            if (result.isConfirmed) {
                let data = {
                    products: [
                        {
                            id: id, 
                            quantity: quantity
                        }
                    ]
                }
                socketServer.emit('event_add_product_to_cart', {isNewCart: true, body: data});
                 
            } else if (result.isDenied) {
                const { value: cart_id } = await Swal.fire({
                    title: 'Enter the cart id',
                    input: 'text',
                    inputLabel: 'ID',
                    inputPlaceholder: 'Ej: 6756d63d3e7632f846cc6a72'
                })
                let data = {
                    product_id: id,
                    quantity: quantity
                }
                socketServer.emit('event_add_product_to_cart', {isNewCart: false, body: data, cart_id: cart_id});
            }

        })
    })
}
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