
const btnsAddToCart = document.getElementsByClassName("add_button")
const btnUpdate = document.getElementById("update")
const btnDelete = document.getElementById("delete")
const products = document.getElementsByClassName("product");

for(let i=0; i < products.length;i++) {
    let id = products[i].id;
    let button = document.getElementById("add_button_"+products[i].id)
    console.log(button)
    button.addEventListener("click", async () => {

        console.log("holandaaa ")
        /*const { value: quantity } = await Swal.fire({
            title: 'How old are you?',
            icon: 'question',
            input: 'range',
            inputLabel: 'Cantidad de productos',
            inputAttributes: {
              min: 1,
              max: 120,
              step: 1
            },
            inputValue: 1
        })*/
        let quantity = 1;
        //let products = document.getElementById("products")
        const data = {
            id: id,
        }
        let requestData = {
            method:"PUT",
            body: JSON.stringify(product),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        let request = new Request(endpoint+'/api/carts/64191c9b2126fbebb493d06e/product'+data.id, requestData) 
        let result = await fetch(request)
        .then( (response) => response.json());
        if(result.status === "WRONG") {
            Swal.fire({
                title: `Producto ${data.id} no creado`,
                description: result.detail
            })
        }
        else {
            Swal.fire({
                title: `Producto ${data.id} creado exitosamente`,
                color: '#716add'
            })
        }
    })
}
//btnAddToCart.addEventListener
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
        else {
            Swal.fire({
                title: `Producto ${data.id} creado exitosamente`,
                color: '#716add'
            })
        }
    }
})
btnUpdate.addEventListener("click", async () => {
    let options = {}; 
    for(let i=0; i < products.length;i++) {
        let id = products[i].id;
        options[id] = id 
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
            field: data.field,
            newValue: data.newValue
        }
        let requestData = {
            method:"PUT",
            body: JSON.stringify(change),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }
        let request = new Request(endpoint+'/api/products/'+parseInt(id), requestData) 
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
})