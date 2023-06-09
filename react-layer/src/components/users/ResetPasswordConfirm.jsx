import React, { useState , useEffect, useContext} from "react";
import Swal from 'sweetalert2';
import { UserContext } from "./UserContext";

function ResetPasswordConfirm() 
{
    const {port,server_port, endpoint} = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState({});
    const [sended, setSended] = useState(false)

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'username') {
            setUsername(value);
        } 
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const data = {username:username,link:`${endpoint+port}/users/resetPassword`};
            console.log(data)
            const result = await fetch(endpoint+server_port+'/api/sessions/resetPasswordConfirm',{
                method:'POST',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: 'include'
            }).then((response)=>response.json())
            if(!result.code===201){
                console.log({...result})
                Swal.fire({
                    title:"Error enviando mail de confirmación",
                    icon:"error",
                    text: result.message? result.message : "Intente con un usuario registrado"
                })
            }
            else {
                setSended(true)
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

        setErrors(errors);
        return isValid;
    };
    const reload = () => {
        setSended(false)
    }
    return (
        <div className="container-fluid m-3 d-flex justify-content-center">
            <div className="card d-flex justify-content-center">
                <h1 className="card-title">Restaura tu contraseña</h1>
                    <div className="shadow-lg bg-body rounded">
                        {
                            sended?
                            <div className="col-md-12">
                                <p>Hemos enviado un correo para recuperar su contraseña</p>
                                <button className="btn btn-primary" onClick={reload}type="button">Volver a enviar</button>
                            </div>
                            :
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
                                    
                                </div>
                                <div className="col-12">
                                    <button className="btn btn-primary" type="submit">Continuar</button>
                                </div>
                            </form>
                        }
                    </div>
            </div>
        </div>
    )
}
export default ResetPasswordConfirm;