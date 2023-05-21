import React from "react";
import { Link} from "react-router-dom";
import LoadLinks from "./LoadLinks";
import CartWidget from "./CartWidget";

function NavBar() {
    const links = [
        {route:"/categoria/cafe",name:"Cafés"},{route:"/categoria/pasteleria",name:"Pasteleria"},{route:"/categoria/merchandising",name:"Merchandising"}
    ];
    return (
        <div className='container-fluid '>
            <div className="row nav-bar">
                <div className="col-md-8 justify-content-center" >
                    <nav className="navbar navbar-expand-sm ">
                        <div className="container-fluid">
                            <Link className="navbar-brand" to="/">
                                <img id="logo" src={"/img/logo.ico"} alt={"Logo"} width={100}/>
                            </Link>
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
                    <CartWidget className="m-2"/>
                    <Link to={"/orders"} className="btn btn-secondary">Ir a órdenes</Link>
                </div>
            </div>
        </div>
    );
}
export default NavBar;
/**
 * <div className="row nav-bar m-2">
        <nav className="col navbar fixed-top">
            <ul id="navBarList" class="navbar-nav nav-bar flex-row justify-content-center">
                <li class="nav-item col-md-6 justify-content-center">
                    <h1>Bienvenido!</h1>
                </li>
                <li class="nav-item col-md-6 justify-content-end"> 
                    {
                        products.token?
                            <div>
                                <button id="btn_profile" class="active btn btn-primary" aria-current="page" href="/users">Perfil</button>
                                <button id="btn_close_session" class="active btn btn-danger" href="" aria-current="page" >Cerrar Sesion</button>
                                <a class="active btn btn-primary" aria-current="page" href="/chat">Prueba nuestro chat!</a>
                            </div>
                            :
                            <button id="btn_login" class="active btn btn-primary" aria-current="page">Iniciar sesion</button>
                    }    
                    <a href="/products">
                        <button id="" type="button" className="btn">
                            <img src="/img/cart2.svg" alt="Carrito" width="25"/>
                            {
                                isCart? 
                                <span id="cart_items" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {{totalCart}} 
                                </span>
                                :null
                            }   
                        </button>
                    </a>
                </li>
            </ul>
        </nav>   
    </div>
 */