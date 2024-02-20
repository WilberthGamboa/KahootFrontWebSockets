import { Manager } from "socket.io-client";

// Inicialización del cliente Socket.IO
const manager = new Manager("http://localhost:3000/socket.io/socket.io.js");
const socket = manager.socket('/');

// Referencias a elementos del DOM
const usuarios = document.getElementById("usuarios");
const temporizador = document.getElementById("temporizador");
const pregunta = document.getElementById("pregunta");
const respuestas = document.getElementById("respuestas");
const formulario = document.getElementById("form");
const input = document.getElementById("nombre");

// Función para limpiar la lista de usuarios
function limpiarUsuarios() {
  usuarios.innerHTML = '';
}

// Función para mostrar usuarios conectados
function mostrarUsuarios(clients) {
  limpiarUsuarios();
  for (const client in clients) {
    const userName = clients[client].name ? clients[client].name : 'ESPERANDO NOMBRE DE USUARIO';
    usuarios.innerHTML += `<li class="list-group-item">${client} - ${userName} - ${clients[client].totalDeRespuestasCorrectas}</li>`;
  }
}

// Función para mostrar una pregunta y sus respuestas
function mostrarPreguntaYRespuestas(text) {
  respuestas.innerHTML = '';
  pregunta.textContent = text.pregunta;
  for (const respuesta of text.respuesta) {
    respuestas.innerHTML += `<button class="answer-button btn btn-primary">${respuesta}</button>`;
  }
}

// Event listener para el envío del formulario (nombre de usuario)
formulario.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    socket.emit('message', { name: input.value });
    input.value = '';
  } catch (error) {
    console.error('Error al enviar el nombre de usuario:', error);
  }
});

// Event listener para el click en una respuesta
respuestas.addEventListener("click", (e) => {
  if (e.target.classList.contains('answer-button')) {
    socket.emit('answer', { name: e.target.textContent });
  }
});

// Eventos de Socket.IO
socket.on("connect", () => {
  limpiarUsuarios();
  console.log("Conectado al servidor");
});

socket.on("disconnect", () => {
  limpiarUsuarios();
  console.log("Desconectado del servidor");
});

socket.on("clients-updated", (clients) => {
  console.log({ clients });
  mostrarUsuarios(clients);
});

socket.on('gamestart', (text) => {
  temporizador.innerHTML = text;
});

socket.on('question', (text) => {
  console.log({ text });
  mostrarPreguntaYRespuestas(text);
});



