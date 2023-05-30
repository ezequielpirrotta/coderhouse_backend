import React, { useContext, useEffect, useState } from "react";
import { Link} from "react-router-dom";
import LoadLinks from "./LoadLinks";
import CartWidget from "./CartWidget";
import { UserContext } from "../users/UserContext";
import { CartContext } from "../carts/CartContext";


function NavBar() { 
    const {user,closeUserSession} = useContext(UserContext)
    const links = [
        {route:"/products?category=comida",name:"Comida"},{route:"/products?category=ropa",name:"Ropa"},{route:"/products?category=otros",name:"Otros"}
    ];
    useEffect( () => {
    },[])
    const onClickCloseButton= () => {
        closeUserSession()
    }
    return (
        <div className='container-fluid'>
            <div className="row nav-bar">
                <div className="col-md-8 justify-content-center">
                    <nav className="navbar navbar-expand-sm">
                        <div className="container-fluid">
                            <Link className="navbar-brand" to="/products"><h1>Inicio</h1></Link>
                            <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                                        <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 2.75zm0 5A.75.75 0 011.75 7h12.5a.75.75 0 110 1.5H1.75A.75.75 0 011 7.75zM1.75 12a.75.75 0 100 1.5h12.5a.75.75 0 100-1.5H1.75z"></path>
                                    </svg>
                                </span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <LoadLinks links={links}/>
                            </div>
                        </div>
                    </nav>   
                </div>
                
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                    {
                        user?
                            <div>
                                <CartWidget className="m-2"/>
                                <Link to={"/users"} className="btn btn-primary">Perfil</Link>
                                <button id="btn_close_session" className="btn btn-danger" onClick={onClickCloseButton} href="" aria-current="page" >Cerrar Sesion</button>
                                <Link to={"/chat"} className="btn btn-secondary">Prueba nuestro chat!</Link>
                            </div>
                            :
                            <Link to={"/"} className="btn btn-primary">Inicia sesion</Link>
                            //<button id="btn_login" className="active btn btn-primary" aria-current="page">Iniciar sesion</button>
                    }
                </div>
            </div>
        </div>
    );
}
export default NavBar;