import {Manager} from "socket.io-client";
const manager = new Manager("http://localhost:3000/socket.io/socket.io.js");
const socket = manager.socket('/')
socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
});