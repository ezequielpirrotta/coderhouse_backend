import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContext";

function CartContent () {
    const {cart,removeItem,clearCart,totalPrice} = useContext(CartContext);
    let count = 0;
    return(
        <div className="container-fluid ">
            <div className="row">
                <div className="col m-3">
                    <h2>Tu Carrito</h2>
                    <Link onClick={clearCart} className="btn btn-danger" title="Vaciar Carrito">Vaciar Carrito</Link>
                </div>
                
            </div>
            <div className="row d-flex flex-column align-items-center">      
                {
                    cart.map((product) => {
                        count++
                        return(
                            <div className={"col-sm accordion"+count} id="accordionExample">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id={"heading"+count}>
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+count} aria-expanded="true" aria-controls={"collapse"+count}>
                                        <img src={product.image} alt={product.name} width={64}/>
                                        <span>{product.name}</span>
                                        <span className="badge bg-primary rounded-pill">{product.quantity}</span>
                                    </button>
                                    </h2>
                                    <div id={"collapse"+count} className="accordion-collapse collapse " aria-labelledby={"heading"+count} data-bs-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <table className="table table-responsive" data-toggle="collapse">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" className="text-center">Cantidad</th>
                                                        <th scope="col" className="text-center">Precio</th>
                                                        <th scope="col">&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr key={product.id}>
                                
                                                        <td className="text-center align-middle">{product.quantity}</td>
                                                        <td className="text-center align-middle">{product.currency} {product.quantity * product.price}</td>
                                                        <td className="text-end align-middle"> <Link onClick={() =>removeItem(product.id)} title="Eliminar Producto">
                                                            <img src={"img/trash3.svg"} alt="Cesto" width={24}/></Link>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>      
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