import React from "react";
import Item from "./Item";
import Error from "../errors_&_timeout/Error";

function ItemList({products})
{
    //console.log(products)
    if(products !== null){
        if(products.length > 0){
            return (
                <div className="row justify-content-center">
                    {
                        products.map(product =>
                        {
                            return(
                                <div key = {product.id} className={products.length >= 3?"product col-sm-4 col-md-3":"product col-sm-4 col-md-5"}>
                                    <Item product={product}></Item>
                                </div>
                            );
                        }
                    )}
                </div>
            );
        }
        else {
            return(
                <Error status={"wait"} quantity={2}/>
            )  
        }
    }
    
    else
    {
        return(
            <Error status={"empty"} quantity={2}/>
        );
    }
}
export default ItemList;

