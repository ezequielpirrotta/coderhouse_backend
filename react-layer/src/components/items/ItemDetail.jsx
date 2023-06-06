import ItemCount from "./ItemCount";
import Error from "../errors_&_timeout/Error";
import React, { useState, useContext } from "react";
import Swal from 'sweetalert2';
import { CartContext } from "../carts/CartContext";
import { Link } from "react-router-dom";
import { MDBCardBody, MDBCardText,MDBCardTitle } from "mdb-react-ui-kit";


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
                                    <ItemCount stock={product.stock} onAdd={onAdd}/>:
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