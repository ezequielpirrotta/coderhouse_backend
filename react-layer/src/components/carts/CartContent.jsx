import React, {useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContext";
import { MDBAccordion,MDBAccordionItem,MDBTable,MDBTableHead,MDBTableBody } from "mdb-react-ui-kit";

function CartContent () {
    const {cart,removeItem,clearCart,totalPrice} = useContext(CartContext);
    
    let count = 0;
    return(
        <div className="container-fluid ">
            <div className="row">
                <div className="col m-3 d-flex justify-content-center">
                    <h2>Tu Carrito</h2>
                    <Link onClick={clearCart} className="btn btn-danger" title="Vaciar Carrito">Vaciar Carrito</Link>
                </div>
                
            </div>
            <div className="row d-flex flex-column align-items-center">      
                {
                    cart.products.map((product) => {
                        count++
                        return(
                            <MDBAccordion id="">
                                <MDBAccordionItem collapseId={count} headerTitle={<>
                                    <img src={product.product.thumbnail} alt={product.product.title} width={64}/> &nbsp; 
                                    {product.product.title}</>
                                }>
                                    <MDBTable>
                                        <MDBTableHead>
                                            <tr>
                                                <th scope="col" className="text-center">Cantidad</th>
                                                <th scope="col" className="text-center">Precio</th>
                                                <th scope="col">&nbsp;</th>
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody>
                                        <tr key={product.product.id}>
                                            <td className="text-center align-middle">{product.quantity}</td>
                                            <td className="text-center align-middle">$ {product.quantity * product.product.price}</td>
                                            <td className="text-end align-middle"> 
                                                <Link onClick={async() =>removeItem(product.product._id)} title="Eliminar Producto">
                                                    <img src={"img/trash3.svg"} alt="Cesto" width={24}/>
                                                </Link>
                                            </td>
                                        </tr>
                                        </MDBTableBody>
                                    </MDBTable>
                                </MDBAccordionItem>
                            </MDBAccordion>   
                        )  
                    })
                }
                    
            </div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="card col-md-3 " width='18rem'>
                        <div className="card-body">
                            <h5 className="card-title">Su compra</h5>
                            <h6 className ="card-subtitle mb-2 text-muted">Total: ${totalPrice()}</h6>
                            <Link className="row btn btn-primary" to={'/checkout'} title="Ir a orden">Ir a orden</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default CartContent;