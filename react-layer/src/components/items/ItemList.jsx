import React from "react";
import Item from "./Item";
import Error from "../errors_&_timeout/Error";
import {
    MDBRow,
    MDBCol,
    MDBBtn
  } from 'mdb-react-ui-kit';

function ItemList({products})
{
    if(products){
        if(products.length > 0){
            return (
                
                <MDBRow className="row-cols-1 row-cols-md-3 g-4 m-2">
                    {
                        products.map(product =>
                        {
                            return(
                                <MDBCol sm='6'>
                                    <Item product={product}></Item>
                                </MDBCol>
                                /*<div key = {product._id} className={products.length >= 3?"product col-sm-4 col-md-3":"product col-sm-4 col-md-5"}>
                                </div>*/
                            );
                        }
                    )}
                </MDBRow>
                
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