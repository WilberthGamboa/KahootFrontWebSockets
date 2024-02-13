import {Manager} from "socket.io-client";
const manager = new Manager("http://localhost:3000/socket.io/socket.io.js");
const socket = manager.socket('/')

const usuarios = document.getElementById("usuarios")
socket.on("connect", () => {
  usuarios.innerHTM = '';
  console.log("Conectado al servidor");
});

socket.on("disconnect", () => {
  usuarios.innerHTM = '';
  console.log("Desconectado del servidor");
});


socket.on("clients-updated", (clients) => {
  console.log({clients})
  usuarios.innerHTML = '';
  for (const client in clients) { 
    if (clients[client].name == '') {
      usuarios.innerHTML = usuarios.innerHTML + ` <li class="list-group-item"> ${client} - ESPERANDO NOMBRE DE USUARIO </li>`
    }else{
      usuarios.innerHTML = usuarios.innerHTML + ` <li class="list-group-item"> ${client} - ${clients[client].name} </li>`
    }
  
  }
  
});


socket.on('gamestart', (text) => {
  console.log({ text });
});



const input= document.getElementById("nombre")



  const formulario = document.getElementById("form")
  formulario.addEventListener("submit",(e) =>{
    e.preventDefault();
    console.log('hola')
  try {
    socket.emit('message',{
      name:input.value
    })

    input.value=''
  } catch (error) {
    console.log(error)
  }
  })


