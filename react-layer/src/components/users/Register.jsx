import React, { useState, useContext} from "react";
import Swal from 'sweetalert2';
import { UserContext } from "./UserContext";
import { InputGroup, FormControl, Button } from "react-bootstrap";

function Register() 
{
    const {user, port, server_port, endpoint} = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState(0);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isCheckedAdmin, setIsCheckedAdmin] = useState(false);
    const [isCheckedPremium, setIsCheckedPremium] = useState(false);

    
    const handleChangeAdmin = () => {
        setIsCheckedAdmin(!isCheckedAdmin);
        if (isCheckedPremium) {
            setIsCheckedPremium(!isCheckedPremium);
        }
    }
    const handleChangePremium = () => {
        setIsCheckedPremium(!isCheckedPremium);
        if (isCheckedAdmin) {
            setIsCheckedAdmin(!isCheckedAdmin);
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'username') {
            setUsername(value);
        } 
        else if (name === 'first_name') {
            console.log("cambié")
            setName(value);
        } 
        else if (name === 'last_name') {
            setLastName(value);
        }  
        else if (name === 'password') {
            setPassword(value);
        }
        else if (name === 'age') {
            setAge(value);
        }
    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const data = {username,password,name,lastName,age, adminRole: isCheckedAdmin,premiumRole: isCheckedPremium};
            console.log(data)
            const result = await fetch(endpoint+server_port+'/api/sessions/register',{
                method:'POST',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: 'include'
            }).then((response)=>response.json())
            if(result.code===201){
                Swal.fire({
                    title:"Usuario creado correctamente",
                    icon:"success",
                    timer: 2000,
                    text: result.message
                })
                setTimeout(()=>{
                    window.location.replace('/');
                },4000)
            }
            else {
                console.log({...result})
                Swal.fire({
                    title:"Error con su registro",
                    icon:"error",
                    text: result.message?result.message:"Intente con un usuario registrado"
                })
            }
        }
        else {
            console.log("no está bien")
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!name) {
            isValid = false;
            errors['name'] = 'Please enter your name.';
        }
        console.log(isValid)
        if (!lastName) {
            isValid = false;
            errors['lastName'] = 'Please enter your last name.';
        }
        if (!username) {
            isValid = false;
            errors['email'] = 'Please enter your email address.';
        } else if (!/\S+@\S+\.\S+/.test(username)) {
            isValid = false;
            errors['email'] = 'Please enter a valid email address.';
        }
        if (!password) {
            isValid = false;
            errors['password'] = 'Please enter your password.';
        }

        setErrors(errors);
        return isValid;
    };
    return (
        <div className="container-fluid m-3 d-flex justify-content-center">
            <div className="card d-flex justify-content-center">
                <h1 className="card-title">Registro</h1>
                { user?
                    <div className="shadow-lg bg-body rounded">
                        <form id="loginForm" className="card-body row g-3 d-flex justify-content-center needs-validation" noValidate>
                            <div className="col-12">
                                <a className="btn btn-primary" href="/products" type="submit">Continuar </a>
                            </div>
                        </form>
                    </div>
                    :
                    <div className="shadow-lg bg-body rounded">
                        <form id="loginForm" onSubmit={handleSubmit} className="card-body row g-3 justify-content-center needs-validation" noValidate>
                            <div className="mb-3 col-md-4">
                                <div>
                                    <label htmlFor="first_name" className="form-label">Nombre</label>
                                    <input type="text" 
                                        className="form-control" 
                                        name="first_name" 
                                        id="first_name" 
                                        placeholder="Paula" 
                                        onChange={handleInputChange}
                                        required/>
                                    <div className="valid-feedback">
                                        ¡Se ve bien!
                                    </div>
                                    <div className="invalid-feedback">
                                        Este campo es requerido
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="form-label">Apellido</label>
                                    <input type="text" 
                                        className="form-control" 
                                        name="last_name" 
                                        id="last_name" 
                                        placeholder="Fernandez" 
                                        onChange={handleInputChange}
                                        required/>
                                    <div className="valid-feedback">
                                        ¡Se ve bien!
                                    </div>
                                    <div className="invalid-feedback">
                                        Este campo es requerido
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 col-md-4">
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
                                </div>
                            </div>
                            <div className="mb-3 col-md-4">
                                <label htmlFor="age" className="form-label">Edad</label>
                                <input type="number" className="form-control" onChange={handleInputChange} name="age" id="age" placeholder="Numero entero" required/>
                                <div className="valid-feedback">
                                    ¡Se ve bien!
                                </div>
                                <div className="invalid-feedback">
                                    Este campo es requerido
                                </div>
                                <label className="form-check-label form-label" htmlFor="role">
                                    Crear como admin
                                </label>
                                <input className="form-check-input " type="checkbox" checked={isCheckedAdmin} onChange={handleChangeAdmin} id="admin_role" name="admin_role"/>
                                <label className="form-check-label form-label" htmlFor="role">
                                    Crear como usuario premium
                                </label>
                                <input className="form-check-input " type="checkbox" checked={isCheckedPremium} onChange={handleChangePremium} id="premium_role" name="premium_role"/>
                            </div>
                            
                            <div className="col-12 justify-content-center">
                                <button className="btn btn-primary" type="submit">Registrarse</button>
                            </div>
                        </form>
                        <p>¿Ya tienes una cuenta? <a href="/">Ingresa aquí</a></p>
                    </div>
                }
            </div>
        </div>
    )
}
export default Register;