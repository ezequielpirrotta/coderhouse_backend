import React, { useState } from "react";
import {MDBIcon} from "mdb-react-ui-kit"

const ItemCount = ({stock, onAdd}) => 
{
    const [items, setItems] = useState(1);
    const [stockProd, setStockProd] = useState(parseInt(stock))
    console.log(stockProd)
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
    
    return(
        <div className = "count-section justify-content-evenly">
            <span className={"btn m-2"+(stockProd>0?"enable":"disabled")} onClick={() => addProduct()}>
                <MDBIcon fas icon="plus" />
            </span>
            <span className="m-2" width="32" height="32">{items}</span>
            <span className={"btn m-2"+(items>0?"enable":"disabled")} onClick={() =>restProduct()}>
                <MDBIcon fas icon="minus" />
            </span>
            <button href="#" className="add_button btn btn-outline-primary" onClick={() =>addToCart()}>
                Añadir al Carrito
            </button>
        </div>
        
    )
}
export default ItemCount;