import React from "react";
import Item from "./Item";
import Error from "../errors_&_timeout/Error";

function ItemList({products})
{
    if(products){
        console.log(products)
        if(products.length > 0){
            return (
                <div className="row justify-content-center">
                    {
                        products.map(product =>
                        {
                            return(
                                <div key = {product._id} className={products.length >= 3?"product col-sm-4 col-md-3":"product col-sm-4 col-md-5"}>
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
/*
<div id="main" class="container-fluid justify-content-center">
    <div className="row nav-bar m-2">
        <nav className="col navbar fixed-top">
            <ul id="navBarList" class="navbar-nav nav-bar flex-row justify-content-center">
                <li class="nav-item col-md-6 justify-content-center">
                    <h1>Bienvenido!</h1>
                </li>
                <li class="nav-item col-md-6 justify-content-end"> 
                    {{#if token}}
                        <button id="btn_profile" class="active btn btn-primary" aria-current="page" href={{linkProfile}}>Perfil</button>
                        <button id="btn_close_session" class="active btn btn-danger" href="" aria-current="page" >Cerrar Sesion</button>
                        <a class="active btn btn-primary" aria-current="page" href="/chat">Prueba nuestro chat!</a>   
                    {{else}}
                        <button id="btn_login" class="active btn btn-primary" aria-current="page">Iniciar sesion</button>    
                    {{/if}}
                    <a href="/products">
                        <button id="" type="button" className="btn">
                            <img src="/img/cart2.svg" alt="Carrito" width="25"/>
                            {{#if isCart }}
                                <span id="cart_items" className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                    {{totalCart}} 
                                </span>
                            {{/if}}   
                        </button>
                    </a>
                </li>
            </ul>
        </nav>   
    </div>
         
        <div id="products" class="row justify-content-center">
            {{#each products.payload}}
                <div key={{this._id}} id={{this._id}}  class="product col-3"> 
                    <div class="card" width= "18rem" >
                        <img src={{this.thumbnail}} class="card-img-top img-fluid btn" alt={{this.title}} />
                        <div class="card-body">
                            <h5 id="title_{{this._id}}" class="card-title">{{this.title}}</h5>
                            <label for="price_{{this._id}}">Precio: $</label>
                            <p id="price_{{this._id}}" class="card-text">{{this.price}}</p>
                            <label for="stock_{{this._id}}">Stock:</label>
                            <p id="stock_{{this._id}}" class="card-text">{{this.stock}}</p>
                            <label for="description_{{this._id}}">Descripción</label>
                            <p id="description_{{this._id}}" class="card-text">{{this.description}}</p>
                            {{#if ../token}}
                                <button id="add_button_{{this._id}}" class="btn btn-primary add_button">Añadir a carrito</button>
                                <button id="edit_button_{{this._id}}" class="btn btn-primary edit_button">Editar</button>
                            {{else}}
                                <button id="logedout_add_button_{{this._id}}" class="btn btn-primary add_button">Añadir a carrito</button>
                                <button id="logedout_edit_button_{{this._id}}" class="btn btn-primary edit_button">Editar</button>
                            {{/if}}

                        </div>
                    </div>
                </div>
            {{/each}}
        </div>
    {{else}}
        <div class="row justify-content-center">
            <div class="col-md-12 alert alert-danger" role="alert">{{products.detail}}</div>
        </div>   
    {{/if}}
</div>

<script src="/socket.io/socket.io.js"></script>
<script type="module" src="/js/products.js"></script>*/