import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const port = '3000';
const endpoint = 'http://localhost:';

function Chat() {

    /**
     * chatBox.addEventListener('keyup',evt=>{
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
                logs += `${log.user} dice: ${log.message}<br/>`
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

     */
    const [inputValue, setInputValue] = useState('');
    const [message, setMessage] = useState([]);
    const socket = io(); // Establish a socket connection
    
    useEffect(() => {
        // Manejar mensajes entrantes
        socket.on('get_message', (message) => {
            setMessage((prevMessages) => [...prevMessages, message]);
        });
    
        // Limpieza al desmontar el componente
        return () => {
            socket.off('chat message');
            socket.disconnect();
        };
    }, []);
    const sendMessage = (e) => {
        e.preventDefault();
        if (inputValue.trim() !== '') {
            socket.emit('send_message', message);
            setInputValue('');
        }
    };

  

  return (
    <div>
      <h1>Chat en tiempo real</h1>
      <ul>
        {message.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
export default Chat;