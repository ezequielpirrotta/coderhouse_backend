import React, { useState , useEffect, useContext} from "react";
import { useParams, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { UserContext } from "./UserContext";

function Profile() 
{
    const {user, loading, endpoint,server_port} = useContext(UserContext);
    
    /*useEffect(  async () => {
        //let result  = await fetch(endpoint+server_port+'/api/sessions/current').then((response)=>response.json())
        fetchUserProfile()
        //setUser(result)
    })*/
    
    return (
        <div className="container">
            <div className="profile">
                { loading ? 
                    <p>Loading user profile...</p>
                    : user ? 
                    <div>
                        <h2 className="profile-heading">User Profile</h2>
                        <div className="profile-details">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                type="text"
                                className="form-control"
                                value={user.first_name+' '+user.last_name}
                                disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                type="email"
                                className="form-control"
                                value={user.username}
                                disabled
                                />
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input
                                type="number"
                                className="form-control"
                                value={user.age}
                                disabled
                                />
                            </div>
                        </div>
                        <Link to={"/orders"} className="btn btn-secondary">Ir a órdenes</Link>
                        <Link to={"/resetPassword"} className="btn btn-secondary">Cambiar contraseña</Link>
                    </div>
                    : 
                    <p>No user profile found.</p>
                }
            </div>
        </div>
    )  
}

export default Profile;