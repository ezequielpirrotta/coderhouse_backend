import React from "react";
import Error from "./errors_&_timeout/Error";

const Order = ({order}) => 
{
    let count = 0;
    if(order !== null && order !== undefined){
        if(typeof order === 'object' && !Array.isArray(order)){
            return (
                
                <div className="card col-5 m-3 d-flex justify-content-center flex-row" width= "18rem" >
                    
                    <div className="card-body">
                        <h5 className="card-title">{"Orden "+order.id}</h5>
                        <p className="card-text">{"Total: $" + order.total}</p>
                        {
                           
                            order.items.map((item) => {
                                count++
                                return(
                                    <div className={"col-sm accordion"+count} id="accordionExample">
                                        <div className="accordion-item">
                                            <h2 className="accordion-header" id={"heading"+count}>
                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={"#collapse"+count} aria-expanded="true" aria-controls={"collapse"+count}>
                                                
                                                <span>{item.name}</span>
                                                <span className="badge bg-primary rounded-pill">{item.quantity}</span>
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
                                                            <tr key={item.id}>
                                        
                                                                <td className="text-center align-middle">{item.quantity}</td>
                                                                <td className="text-center align-middle">{item.currency} {item.quantity * item.price}</td>
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
                </div>
            );
        }
        else if(order === undefined){
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
export default Order;
