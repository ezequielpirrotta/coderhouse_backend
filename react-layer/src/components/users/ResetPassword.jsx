import React, { useState , useEffect, useContext} from "react";
import { InputGroup,FormControl, Button } from "react-bootstrap";
import Swal from 'sweetalert2';
import { UserContext } from "./UserContext";
import { useParams } from "react-router-dom";
import { useJwt } from "react-jwt";

function ResetPassword() 
{
    const {user, port, server_port, endpoint} = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const {token} = useParams();
    const {isExpired} = useJwt(token)

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'username') {
            setUsername(value);
        } 
        else if (name === 'password') {
            setNewPassword(value);
        }
        else if (name === 'confirmPassword') {
            setConfirmNewPassword(value)
        }

    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const data = {username, newPassword, confirmNewPassword};
            console.log(data)
            const result = await fetch(endpoint+server_port+'/api/sessions/resetPassword',{
                method:'POST',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: 'include'
            }).then((response)=>response.json())
            if(result.code===201){
                window.location.replace('/');
            }
            else {
                console.log({...result})
                Swal.fire({
                    title:"Error restableciendo su contraseña",
                    icon:"error",
                    text: result.error? result.error : "Ha ocurrido un error inesperado"
                })
            }
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!username) {
            isValid = false;
            errors['email'] = 'Please enter your email address.';
        } else if (!/\S+@\S+\.\S+/.test(username)) {
            isValid = false;
            errors['email'] = 'Please enter a valid email address.';
        }

        if (!newPassword) {
            isValid = false;
            errors['password'] = 'Please enter your password.';
        }
        if (newPassword && !confirmNewPassword) {
            isValid = false;
            errors['password'] = 'Please confirm your password.';
        }
        if(newPassword !== confirmNewPassword){
            isValid = false;
            errors['password'] = 'Passwords must be equals.';
        }

        setErrors(errors);
        return isValid;
    };
    
    return (
        <div className="container-fluid m-3 d-flex justify-content-center">
            <div className="card d-flex justify-content-center">
                <h1 className="card-title">Restablece tu contraseña</h1>
                { isExpired?
                    <div className="shadow-lg bg-body rounded">
                        <form id="loginForm" className="card-body row g-3 justify-content-center needs-validation d-flex align-items-center" noValidate>
                            <div className = "col-12 justify-content-center">
                                <div className = "product alert alert-danger" role = "alert">
                                    Tu link expiró!
                                </div>
                            </div>
                            <div className="col-12 justify-content-center">
                                <a className="btn btn-primary" href="/users/resetPassword/sendEmail" type="submit">Enviar de nuevo </a>
                            </div>
                        </form>
                    </div>
                    :
                    <div className="shadow-lg bg-body rounded">
                        <form id="loginForm" onSubmit={handleSubmit} className="card-body row g-3 justify-content-center needs-validation" noValidate>
                            <div className="col-md-12">
                                <label htmlFor="username" className="form-label">Email</label>
                                <input type="text" 
                                    className={`form-control ${errors['email'] ? 'is-invalid' : ''}`} 
                                    name="username" 
                                    id="username" placeholder="someone@gmail.com" required
                                    onChange={handleInputChange} 
                                />
                                <div className="valid-feedback">
                                    ¡Se ve bien!
                                </div>
                                {errors['email'] && <div className="invalid-feedback">{errors['email']}</div>}

                                <div className="mb-3 col-md-4"></div>
                                <div className="input-group flex-column">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control ${errors['password'] ? 'is-invalid' : ''}`}
                                            name="password"
                                            id="password" placeholder="*******" required
                                            onChange={handleInputChange}
                                        >

                                        </FormControl>
                                        {errors['password'] && <div className="invalid-feedback">{errors['password']}</div>}

                                        <Button
                                            variant="outline-secondary"
                                            onClick={toggleShowPassword}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {showPassword ? (
                                            <i className="fa fa-eye-slash"></i>
                                            ) : (
                                            <i className="fa fa-eye"></i>
                                            )}
                                        </Button>
                                        
                                    </InputGroup>
                                    <label htmlFor="confirmPassword" className="form-label">Confirma tu contraseña</label>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control ${errors['password'] ? 'is-invalid' : ''}`}
                                            name="confirmPassword"
                                            id="confirmPassword" placeholder="*******" required
                                            onChange={handleInputChange}
                                        >
                                        </FormControl>
                                    </InputGroup>
                                    {errors['password'] && <div className="invalid-feedback">{errors['password']}</div>}
                                </div>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" type="submit">Restablecer</button>
                            </div>
                        </form>
                    </div>
                }
            </div>
        </div>
    )
}
export default ResetPassword;