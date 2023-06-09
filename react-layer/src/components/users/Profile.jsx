import React, { useState , useEffect, useContext} from "react";
import { useParams, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { UserContext } from "./UserContext";

function Profile() 
{
    const {user, loading, changeRol} = useContext(UserContext);
    
    /*useEffect(  async () => {
        //let result  = await fetch(endpoint+server_port+'/api/sessions/current').then((response)=>response.json())
        fetchUserProfile()
        //setUser(result)
    })*/
    
    return (
        <div className="container">
            <div className="profile">
                { loading ? 
                    <h2>Loading user profile...</h2>
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
                            <div className="form-group">
                                <label>Role</label>
                                <input
                                type="text"
                                className="form-control"
                                value={user.role}
                                disabled
                                />
                            </div>
                        </div>
                        <Link to={"/orders"} className="btn btn-secondary">Ir a órdenes</Link>
                        <Link className="btn btn-secondary" onClick={changeRol}>Cambiar rol</Link>
                    </div>
                    : 
                    <h2>No user profile found.</h2>
                }
            </div>
        </div>
    )  
}

export default Profile;