
const form = document.getElementById('loginForm');
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})()
window.addEventListener("load", function() {

    // icono para mostrar contraseña
    showPassword = document.querySelector('.show-password');
    showPassword.addEventListener('click', () => {

        // elementos input de tipo clave
        password = document.getElementById('password');
        
        if ( password.type === "text" ) {
            password.type = "password"
            showPassword.classList.remove('fa-eye-slash');
        } else {
            password.type = "text"
            showPassword.classList.toggle("fa-eye-slash");
        }

    })

});
form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    const result = await fetch('/api/sessions/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then((response)=>response.json())
    if(result.code===200){
        window.location.replace('/products');
    }
    else {
        Swal.fire({
            title:"Error",
            icon:"error",
            text: "Error con su inicio de sesión, intente con un usuario registrado"
        })
    }
})