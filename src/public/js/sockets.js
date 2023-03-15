const socketServer = io()
const btnCreate = document.getElementById("create")
const btnUpdate = document.getElementById("update")
const btnDelete = document.getElementById("delete")
const products = document.getElementsByClassName("product");

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
        socketServer.emit('event_create_product', {...product});
    }
})
btnUpdate.addEventListener("click", async () => {
    let options = {}; 
    for(let i=0; i < products.length;i++) {
        let id = products[i].id;
        let title = document.getElementById("title_"+products[i].id).innerHTML
        options[id] = title
    }
    const { value: id } = await Swal.fire({
        title: 'Select an ID',
        input: 'select',
        inputLabel: 'ID',
        inputOptions: options,
        inputAttributes: {
            maxlength: 10,
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        inputValidator: (value) =>{
            if (!value){
                return "Debes seleccionar un ID."
            } else{
                socketServer.emit("userConnected", {user: value});
            }
        }
    })
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
        const data = {
            id: id,
            field: field,
            newValue: newValue
        }
        socketServer.emit('event_update_product', data);
    }
})
btnDelete.addEventListener("click", async () => {
    let options = {}; 
    for(let i=0; i < products.length;i++) {
        let id = products[i].id;
        let title = document.getElementById("title_"+products[i].id).innerHTML
        options[id] = title 
    }
    const { value: id } = await Swal.fire({
        title: 'Select an ID',
        input: 'select',
        inputLabel: 'ID',
        inputOptions: options,
        inputAttributes: {
            maxlength: 10,
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        inputValidator: (value) =>{
            if (!value){
                return "Debes seleccionar un ID."
            }
        }
    })
    if (id) {
        const data = {
            id: id,
        }
        socketServer.emit('event_delete_product', data);
    }
})
socketServer.on("event_product_updated", data => {
    let fieldToUpdate= document.getElementById(`${data.fieldUpdated}_${data._id}`)
    fieldToUpdate.innerHTML = data.newValue;
    Swal.fire({
        title: `Producto ${data._id} actualizado`,
        toast: true,
        timer: 2500,
        timerProgressBar: true,
        position: 'top-end',
        color: '#716add'
    })
})
socketServer.on("event_updating_error", data => {
    Swal.fire({
        title: `Producto ${data.id} no actualizado`,
        text: data.e
    })
})
socketServer.on("event_product_deleted", data => {
    let products = document.getElementById("products")
    let child = document.getElementById(data.id) 
    products.removeChild(child);

    Swal.fire({
        title: `Producto ${data.id} eliminado`,
        toast: true,
        timer: 2500,
        timerProgressBar: true,
        position: 'top-end',
        color: '#716add'
    })
})
socketServer.on("event_deleting_error", data => {
    Swal.fire({
        title: `Producto ${data.id} no se eliminó`,
        text: data.e
    })
})
socketServer.on("event_product_created", data => {
    let fieldToUpdate= document.getElementById("products")
    const newProductDiv = document.createElement("div")
    newProductDiv.innerHTML = `
        <div id=${data._id} key = ${data._id} class="product"> 
            <div class="card" width= "18rem" >
                <img src=${data.thumbnail} class="card-img-top img-fluid btn" alt=${data.title} />
                <div class="card-body">
                    <h5 id="title_${data._id}" class="card-title">${data.title}</h5>
                    <label for="price_${data._id}">Precio: $</label>
                    <p id="price_${data._id}" class="card-text">${data.price}</p>
                    <label for="stock_${data._id}">Stock:</label>
                    <p id="stock_${data._id}" class="card-text">${data.stock}</p>
                    <label for="description_${data._id}">Descripción</label>
                    <p id="description_${data._id}" class="card-text">${data.description}</p> 
                </div>
            </div>
        </div>
    ` 
    fieldToUpdate.appendChild(newProductDiv);
    Swal.fire({
        title: `Producto ${data._id} creado exitosamente`,
        toast: true,
        timer: 2500,
        timerProgressBar: true,
        position: 'top-end',
        color: '#716add'
    })
})
socketServer.on("event_creating_error", error => {
    Swal.fire({
        icon: 'error',
        title: `Error en la creación del producto`,
        text: 'Detalle de error: '+error.message
    })
})