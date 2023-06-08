import ItemCount from "./ItemCount";
import Error from "../errors_&_timeout/Error";
import React, { useState, useContext } from "react";
import Swal from 'sweetalert2';
import { CartContext } from "../carts/CartContext";
import { Link } from "react-router-dom";
import { MDBCardBody, MDBCardText,MDBCardTitle } from "mdb-react-ui-kit";

const server_port = '8080';
const endpoint = 'http://localhost:';

const ItemDetail = ({product}) => 
{
    const {addItem} = useContext(CartContext);
    const [sold, setSold] = useState(false);
    const onAdd = async (quantity, stock) => {
        if((stock > 0) && (quantity <= stock)) {
            await addItem(product, quantity);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Haz añadido '+quantity+' items a tu carrito',
                showConfirmButton: false,
                timer: 2000
            })
            setSold(true);
        }
        else {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Lo sentimos! No contamos con más stock para este item!',
                showConfirmButton: false,
                timer: 2000
            })
        }
    }
    const onEdit = async() => {
        Swal.fire({
            title: 'Edit Product',
            html:  `
                    <div>
                        <select id="property" class="swal2-input" aria-label="Default select example">
                            <option selected value="title">Titulo</option>
                            <option value="description">Descripción</option>
                            <option value="price">Precio</option>
                        </select>
                        <input type="text" id="newValue" class="swal2-input" placeholder="new value">
                    </div>`,
            confirmButtonText: 'update',
            focusConfirm: false,
            preConfirm: () => {
                const property = Swal.getPopup().querySelector('#property').value
                const newValue = Swal.getPopup().querySelector('#newValue').value

                if (!property || !newValue) {
                    Swal.showValidationMessage(`Please complete all the fields`)
                }
                return { property: property, newValue: newValue}
            }
        }).then((result) => {
            
            let data = {
                newValue: result.value.newValue,
                field: result.value.property
            }
            
            let requestData = {
                method:"PUT",
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include'
            }
            const request = new Request(endpoint+server_port+'/api/products/'+product._id, requestData)
            fetch(request)
            .then( async (response) => {
                
                if (!response.ok) {
                    const error = await response.json()
                    console.log(error)
                    if(error.status === "WRONG") {
                        Swal.fire({
                            title: `Producto no creado`,
                            icon: "error",
                            text: error.message
                        })
                    }
                    else if(error.code === "Unauthorized"){
                        Swal.fire({
                            title: `No tienes permisos para crear`,
                            icon: "error"
                        })
                    }
                } 
                else {
                    Swal.fire({
                        icon: "success",
                        title: `Producto ${product.title} - ${product._id} actualizado exitosamente`,
                        color: '#716add'
                    })
                }
            })
        })
    }
    const onDelete = async() => {
        Swal.fire({
            title: 'Delete Product',
            html:  `
                    <div>
                        <input type="text" id="title" class="swal2-input" placeholder="title">
                        <select id="property" class="swal2-input" aria-label="Default select example">
                            <option selected value="title">Titulo</option>
                            <option value="description">Descripción</option>
                            <option value="precio">Precio</option>
                        </select>
                        <input type="text" id="newValue" class="swal2-input" placeholder="image">
                    </div>`,
            confirmButtonText: 'Create',
            focusConfirm: false,
            preConfirm: () => {
                const property = Swal.getPopup().querySelector('#property').value
                const newValue = Swal.getPopup().querySelector('#newValue').value

                if (!property || !newValue) {
                    Swal.showValidationMessage(`Please complete all the fields`)
                }
                return { property: property, newValue: newValue}
            }
        }).then((result) => {
            
            let data = {
                stock: parseInt(result.value.stock),
                thumbnail: result.value.image
            }
            
            let requestData = {
                method:"POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include'
            }
            const request = new Request(endpoint+server_port+'/api/products/', requestData)
            fetch(request)
            .then( async (response) => {
                
                if (!response.ok) {
                    const error = await response.json()
                    if(error.status === "WRONG") {
                        Swal.fire({
                            title: `Producto no creado`,
                            icon: "error",
                            text: error.message
                        })
                    }
                    else if(error.code === "Unauthorized"){
                        Swal.fire({
                            title: `No tienes permisos para crear`,
                            icon: "error"
                        })
                    }
                } 
                else {
                    Swal.fire({
                        icon: "success",
                        title: `Producto ${product._id} actualizado exitosamente`,
                        color: '#716add'
                    })
                }
            })
        })
    }
    if(product !== null) {
        if(!Array.isArray(product)) {
            return(
                <div className="row justify-content-center">
                   <div className="product col-md-4 ">
                        <div className ="card" width= "18rem">
                            <img src={product.image} className ="card-img-top" alt={product.name}/>
                            <MDBCardBody>
                                <MDBCardTitle>{product.title}</MDBCardTitle>
                                <MDBCardText>
                                    {"Precio: $ " + product.price}
                                </MDBCardText>
                                <MDBCardText>
                                    {"Descripción: " + product.description}
                                </MDBCardText>
                                <MDBCardText>
                                    {"Stock: " + product.stock}
                                </MDBCardText>
                                {!sold ? 
                                    <ItemCount stock={product.stock} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete}/>:
                                    <Link className="btn btn-outline-primary" to={"/cart"}>Terminar Compra</Link>
                                }
                            </MDBCardBody>
                        </div>   
                    </div>
                </div>
            );
        }
        return(
            <Error status={"wait"} quantity={1}/>
        );
    }
    else {
        return(
            <Error status={"empty"} quantity={1}/>
        )
    }
    
}
export default ItemDetail;