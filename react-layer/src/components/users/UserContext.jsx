import React from "react";
import { useState, createContext } from "react";
import { useEffect } from "react";
import Swal from 'sweetalert2';
import io from 'socket.io-client';

export const UserContext = createContext();

function UserContextProvider({children}) {
    const port = '3000';
    const server_port = '8080';
    const endpoint = 'http://localhost:';
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const socket = io();
   
    useEffect(() => {
        
        getUser()
        .then( async (userData) => { 
            console.log(userData)
            setUser(userData);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching user profile:', error);
            Swal.fire({
                title:"An error occurred while fetching the user profile.",
                icon:"error",
                text: error.message
            })
            setLoading(false);
        });
        
    },[])
    const getUser = async () => {
        const response = await fetch(endpoint+server_port+'/api/sessions/current', {credentials: 'include'})
        let userData = await response.json();
        if(response.status === 401){
            userData = null
        }
        else {
            if(!Object.keys(user).length === 0 ){
                userData = null
            }
        }
        return userData;
    }
    const closeUserSession = async () => {
        Swal.fire({
            title: 'Are you sure you want to exit?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then( async (result) => {
            if (result.isConfirmed) {
                const result = await fetch(endpoint+server_port+'/api/sessions/logout',{credentials: 'include'})
                .then((response)=>response.json())
                if(result.error){
                    Swal.fire({
                        title:"Error",
                        icon:"error",
                        text: result.message
                    })
                }
                else {
                    socket.emit('event_logout_user');
                    window.location.replace('/');
                }
            }
        })
    } 
    return(
        <UserContext.Provider 
            value={{
                user,
                loading,
                port,
                server_port,
                endpoint,
                closeUserSession
            }}>
            {children}
        </UserContext.Provider>
    );
}
export default UserContextProvider;