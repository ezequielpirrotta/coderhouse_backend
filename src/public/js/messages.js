const socket = io();
const chatBox = document.getElementById('chatBox');
let user = null;
const getUser = async () => {
    user = await fetch('http://localhost:8080/api/sessions/current').then((response) => response.json());
    if(!user){
        Swal.fire({
            icon: "info",
            title: 'Identificate, por favor.',
            input: "text",
            text: 'Ingresa el usuario para identificarte en el chat',
            color: '#716add',
            inputValidator: (value) =>{
                if(!value){
                    return 'Necesitas escribir tu nombre de usuario para continuar!';
                }
                //Parte 2
                else {
                    socket.emit('userConnected', {user: value});
                }
            },
            allowOutsideClick: false //Impide que el usuario se pueda salir del modal haciendo click afuera.
        }).then(result =>{
            user = result.value; //Guardamos el valor ingresado por el usuario si el paso anterior es exitoso.
        });
    }
    else {
        if(user.role==='admin'){
            
        }
        socket.emit('userConnected', {user: value});
        console.log(user)
    }
}
getUser();

//Guardar mensajes por usuario y mostrarlo en nuesto log de mensajes.
chatBox.addEventListener('keyup',evt=>{
    if(user){
        console.log(user)
    } 
    if(evt.key==="Enter"){
        if (chatBox.value.trim().length > 0){
            socket.emit('message',{user: user, message: chatBox.value});
            chatBox.value="";
        } else{
            alert("Por favor escribe una palabra, los espacios no se consideran un mensaje.");
        }
    }
});
socket.on('messageLogs',data=>{
    const messageLogs = document.getElementById('messageLogs');
    let logs='';
    data.forEach(log=>{
        logs += `${log.user.name}: ${log.message}<br/>`
    })
    messageLogs.innerHTML=logs;
});

//Parte 2
socket.on('userConnected',data=>{
    console.log(data);
    let message = `Usuario nuevo conectado: ${data}`;
    Swal.fire({
        icon: "info",
        title: "Nuevo usuario entra al chat!",
        text: message,
        toast: true,
        color: '#716add'
    });
});
