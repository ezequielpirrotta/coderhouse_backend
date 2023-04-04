const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirm-password');

// Password Matching Validation
function validatePasswords() {
  if (passwordInput.value !== confirmInput.value) {
    confirmInput.setCustomValidity("Passwords do not match.");
  } else {
    confirmInput.setCustomValidity('');
  }
}

// Password Input Event Listeners
passwordInput.addEventListener('change', validatePasswords);
confirmInput.addEventListener('keyup', validatePasswords);
confirmInput.addEventListener('change', validatePasswords);

// Form Validation
const form = document.getElementById('resetPasswordForm');
form.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }
  form.classList.add('was-validated');
});
window.addEventListener("load", function() {
    // icono para mostrar contraseña
    showPassword = document.querySelector('.show-password');
    showPassword.addEventListener('click', () => {

        if (passwordInput.type === "text" ) {
            passwordInput.type = "password"
            confirmInput.type = "password"
            showPassword.classList.remove('fa-eye-slash');
        } else {
            passwordInput.type = "text"
            confirmInput.type = "text"
            showPassword.classList.toggle("fa-eye-slash");
        }
    })
});

form.addEventListener('submit',async (event)=>{
    event.preventDefault();
    if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
    }
    else {
        const data = new FormData(form);
        const obj = {};
        data.forEach((value,key)=>obj[key]=value);
        const result = await fetch('/api/sessions/resetPassword',{
            method:'POST',
            body:JSON.stringify(obj),
            headers:{
                'Content-Type':'application/json'
            }
        }).then((response)=>response.json())
        if(result.status !== 'error'){
            window.location.replace('/');
        }
        else {
            Swal.fire({
                title:"Error",
                icon:"error",
                text: result.message
            })
        }
    }
    form.classList.add('was-validated');
})