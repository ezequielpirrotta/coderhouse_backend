import React, { useContext, useState } from "react";
import {MDBBtn, MDBIcon} from "mdb-react-ui-kit"
import { Link } from "react-router-dom";
import { UserContext } from "../users/UserContext";

const ItemCount = ({stock, onAdd, onEdit, onDelete}) => 
{
    const {user} = useContext(UserContext);
    const [items, setItems] = useState(1);
    const [stockProd, setStockProd] = useState(parseInt(stock))
    
    const addProduct = () => {
        if(items < stockProd ) {
            setItems(items + 1);
        }
    }
    const restProduct = () =>
    {
        if(items > 1) {
            setItems(items - 1);
        }
    }
    const addToCart = () => {
        onAdd(items, stockProd)
        setStockProd(stockProd - items)
        setItems(1)
        if(stockProd < 0) {
            setStockProd(0)
        }
    }
    const editProduct = () => {
        onEdit()
    }
    const deleteProduct = () => {
        onDelete()
    }
    
    return(
        <div className = "count-section container justify-content-evenly">
            <div className="d-flex align-items-center">
                <span className={"btn m-2"+(stockProd>0?"enable":"disabled")} onClick={() => addProduct()}>
                    <MDBIcon fas icon="plus" />
                </span>
                <span className="m-2" width="32" height="32">{items}</span>
                <span className={"btn m-2"+(items>0?"enable":"disabled")} onClick={() =>restProduct()}>
                    <MDBIcon fas icon="minus" />
                </span>
                <Link href="#" className="" onClick={() =>addToCart()}>
                    <MDBBtn rounded>Añadir al Carrito</MDBBtn> 
                </Link>
            </div>
            {
                user.role === 'premium' || user.role === 'admin'? 
                    <div className="m-3 d-flex justify-content-evenly ">
                        <Link className="" onClick={() =>editProduct()}>
                            <MDBBtn rounded color="warning">Editar</MDBBtn>
                        </Link>
                        <Link className="btn btn-outline-danger" onClick={() =>deleteProduct()}>Eliminar</Link>
                    </div>
                    : null
            }

        </div>
        
    )
}
export default ItemCount;