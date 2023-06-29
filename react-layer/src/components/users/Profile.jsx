import React, { useState , useEffect, useContext} from "react";
import { useParams, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { UserContext } from "./UserContext";

function Profile() 
{
    const {user, loading, changeRol, uploadDocs} = useContext(UserContext);
    
    /*useEffect(  async () => {
        //let result  = await fetch(endpoint+server_port+'/api/sessions/current').then((response)=>response.json())
        fetchUserProfile()
        //setUser(result)
    })*/
    
    return (
        <div className="container justify-content-center">
            { loading ? 
                <h2>Loading user profile...</h2>
                : user ? 
                <div>

                    <div className="row profile justify-content-center">
                        <div className="col-sm-4 col-md-3">
                            
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
                            
                        </div>
                    </div>
                    <div className="m-2 row d-flex justify-content-center align-items-center">
                        <div className="col d-flex flex-column ">
                            <Link to={"/orders"} className="btn btn-secondary p-2">Ir a órdenes</Link>
                        </div>
                        <div className="col d-flex flex-column ">
                            <Link className="btn btn-info p-2" onClick={uploadDocs}>Documentación</Link>
                        </div>
                        <div className="col d-flex flex-column justify-content-between">
                            <Link className="btn btn-warning p-2" onClick={changeRol}>Cambiar rol</Link>
                        </div>
                    </div>
                </div>
                : 
                <h2>No user profile found.</h2>
            }
        </div>
    )  
}

export default Profile;