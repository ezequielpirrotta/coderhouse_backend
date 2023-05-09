import React from "react";

function Error ({status, quantity}) {
    
    let message = "";
    let class_name = "product col-md-12 alert ";
    if(status) {
        if(status === "wait" && quantity > 1) {
            message = "Espera mientras cargamos tus productos!";
            class_name = class_name + "alert-warning";
        }
        else if(status === "wait") {
            message = "Espera mientras cargamos tu producto!";
            class_name = "product col-md-4 alert alert-warning";
        }
        if(status === "empty" && quantity > 1) {
            message = "No encontramos productos!";
            class_name = class_name + "alert-danger";
        }
        else if(status === "empty") {
            message = "No encontramos el producto elegido! ";
            class_name = "product col-md-4 alert alert-danger";
        }   
    }
    return(
        <div className = "row justify-content-center">
            <div className = {class_name} role = "alert">
                {message}
            </div>
        </div>
    ); 
}
export default Error;