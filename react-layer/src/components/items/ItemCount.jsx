import React, { useState } from "react";


const ItemCount = ({stock, onAdd}) => 
{
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
    
    return(
        <div className = "count-section">
            <span className="btn" onClick={() => restProduct()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32">
                    <path fillRule="evenodd" d="M2.75 2.5h10.5a.25.25 0 01.25.25v10.5a.25.25 0 01-.25.25H2.75a.25.25 0 01-.25-.25V2.75a.25.25 0 01.25-.25zM13.25 1H2.75A1.75 1.75 0 001 2.75v10.5c0 .966.784 1.75 1.75 1.75h10.5A1.75 1.75 0 0015 13.25V2.75A1.75 1.75 0 0013.25 1zm-2 7.75a.75.75 0 000-1.5h-6.5a.75.75 0 000 1.5h6.5z"></path>
                </svg>
            </span>
            <span width="32" height="32">{items}</span>
            <span className="btn" onClick={() =>addProduct()}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="32" height="32">
                    <path fillRule="evenodd" d="M13.25 2.5H2.75a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V2.75a.25.25 0 00-.25-.25zM2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 15H2.75A1.75 1.75 0 011 13.25V2.75C1 1.784 1.784 1 2.75 1zM8 4a.75.75 0 01.75.75v2.5h2.5a.75.75 0 010 1.5h-2.5v2.5a.75.75 0 01-1.5 0v-2.5h-2.5a.75.75 0 010-1.5h2.5v-2.5A.75.75 0 018 4z"></path>
                </svg>
            </span>
            <button href="#" className="add_button btn btn-outline-primary" onClick={() =>addToCart()}>
                Añadir al Carrito
            </button>
        </div>
        
    )
}
export default ItemCount;