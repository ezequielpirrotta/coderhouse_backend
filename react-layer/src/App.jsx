/**Contextos */
import CartContextProvider from './components/carts/CartContext';
import UserContextProvider from './components/users/UserContext';
/* Items */
import ItemDetailContainer from './components/items/ItemDetailContainer';
import ItemListContainer from './components/items/ItemListContainer';
/* Estilos */
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
/** Componentes y Otros */
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import React from 'react';
import NavBar from './components/nav/NavBar';
import Cart from './components/carts/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import Chat from './components/Chat';
import Profile from './components/users/Profile';
import Login from './components/users/Login';
import Register from './components/users/Register';
import ResetPassword from './components/users/ResetPassword';
import ResetPasswordConfirm from './components/users/ResetPasswordConfirm';

function App() {
  return (
    <div>
      <UserContextProvider>
        <CartContextProvider>
          <BrowserRouter>    
            <NavBar/>
            <Routes>
              <Route path={"/"} element={<Login/>}/> 
              <Route path={'/users/resetPassword/sendEmail'} element={<ResetPasswordConfirm/>}/>
              <Route path={'/users/resetPassword/:token'} element={<ResetPassword/>}/>
              <Route path={'/register'} element={<Register/>}/>
              <Route path={'/users'} element={<Profile/>}/>
              <Route path={"/products"} element={<ItemListContainer/>}/> 
              <Route path={"/categoria/:cat"} element={<ItemListContainer/>}/> 
              <Route path={"/producto/:id"} element={<ItemDetailContainer/>}/> 
              <Route path={"/cart"} element={<Cart/>}/>
              <Route path={"/checkout"} element={<Checkout/>}/>
              <Route path={"/orders"} element={<Orders/>}/>
              <Route path={"/orders/:orderId"} element={<Orders/>}/>
              <Route path={'/chat'} element={<Chat />} /> 
            </Routes>
          </BrowserRouter>
        </CartContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
