<script>
	import { onMount } from "svelte";
	import { io } from "socket.io-client";
	let socket;

	onMount(() => {
		socket = io("http://localhost:3000");

		const usuarios = document.getElementById("usuarios");
		const temporizador = document.getElementById("temporizador");
		const pregunta = document.getElementById("pregunta");
		const respuestas = document.getElementById("respuestas");
		const formulario = document.getElementById("form");
		const input = document.getElementById("nombre");
		let numeroPregunta = 0;

		function limpiarUsuarios() {
			usuarios.innerHTML = "";
		}

		function mostrarUsuarios(clients) {
			limpiarUsuarios();
			const sortedClients = Object.values(clients).sort((a, b) => {
				return (
					b.totalDeRespuestasCorrectas - a.totalDeRespuestasCorrectas
				);
			});

			sortedClients.forEach((client) => {
				const userName = client.name
					? client.name
					: "Usuario No Registrado";
				usuarios.innerHTML += `<li class="list-group-item">${userName} - ${client.totalDeRespuestasCorrectas}</li>`;
			});
		}

		function mostrarPreguntaYRespuestas(text) {
			respuestas.innerHTML = "";
			pregunta.textContent = text.pregunta;
			for (const respuesta of text.respuesta) {
				respuestas.innerHTML += `<button class="answer-button btn btn-primary">${respuesta}</button>`;
			}
		}

		formulario.addEventListener("submit", (e) => {
			e.preventDefault();
			try {
				socket.emit("message", { name: input.value });
				input.value = "";
				formulario.remove();
			} catch (error) {
				console.error("Error al enviar el nombre de usuario:", error);
			}
		});

		respuestas.addEventListener("click", (e) => {
			if (e.target.classList.contains("answer-button")) {
				socket.emit("answer", { name: e.target.textContent });
			}
		});

		socket.on("connect", () => {
			limpiarUsuarios();
			console.log("Conectado al servidor");
		});

		socket.on("disconnect", () => {
			limpiarUsuarios();
			console.log("Desconectado del servidor");
		});

		socket.on("clients-updated", (clients) => {
			mostrarUsuarios(clients);
		});

		socket.on("gamestart", (text) => {
			temporizador.innerHTML = text;
			if (numeroPregunta == 5 && text == 0) {
				var listaJugadores = document
					.getElementById("usuarios")
					.getElementsByTagName("li");
				document.getElementById("contenedorxd").innerHTML = "";
				mostrarTablaResultados(listaJugadores);
			}
		});

		socket.on("question", (text) => {
			numeroPregunta += 1;
			mostrarPreguntaYRespuestas(text);
		});

		respuestas.addEventListener("click", (e) => {
			const buttons = document.getElementsByClassName("answer-button");
			for (let button of buttons) {
				button.disabled = true;
			}
		});

		function mostrarTablaResultados(listaJugadores) {
			var jugadores = Array.from(listaJugadores).map(function (li) {
				return li.textContent.trim();
			});
			var resultados = document.createElement("div");
			resultados.innerHTML = `
				<table id="resultados">
					<thead>
						<tr>
							<th>Posición</th>
							<th>Jugador</th>
							<th>Puntuación</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
				<a href="#" onclick="window.location.reload();">Volver a jugar
                </a>
			`;
			document.getElementById("contenedorxd").appendChild(resultados);

			var tablaCuerpo = document
				.getElementById("resultados")
				.getElementsByTagName("tbody")[0];

			for (var i = 0; i < 3 && i < jugadores.length; i++) {
				var jugadorInfo = jugadores[i].split(" - ");
				var posicion = i + 1;
				var jugador = jugadorInfo[0];
				var puntuacion = jugadorInfo[1];
				var fila = document.createElement("tr");
				fila.innerHTML = `
					<td>${posicion}</td>
					<td>${jugador}</td>
					<td>${puntuacion}</td>
				`;
				tablaCuerpo.appendChild(fila);
			}
		}
	});
</script>

<main>
	<div class="container" id="contenedorxd">
		<h1>¡Bienvenido a mi Kahoot UADY!</h1>
		<div class="question">
			<h2>Jugadores en la Sala:</h2>
			<ul class="answers list-group" id="usuarios"></ul>
		</div>
		<form class="form-group" id="form">
			<label for="nombre">Nombre:</label>
			<input
				type="text"
				class="form-control"
				id="nombre"
				placeholder="Introduzca su nombre"
			/>
			<button type="submit">Enviar nombre</button>
		</form>
		<div id="temporizador"></div>
		<div class="question-container">
			<h2 id="pregunta"></h2>
			<ul class="answers list-group" id="respuestas"></ul>
		</div>
	</div>
</main>

<style>
	.container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #0c3; /* Neon green background */
		border-radius: 10px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.3); /* Shadow effect */
		font-family: "Press Start 2P", cursive;
		background-image: url("https://mir-s3-cdn-cf.behance.net/project_modules/fs/9c3404112981173.601ebcc1dba2d.gif"); /* Animated background */
		background-size: cover;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	h1 {
		font-size: 42px;
		animation: neon 1.5s infinite alternate; /* Neon animation */
	}

	@keyframes neon {
		0% {
			text-shadow:
				0 0 10px #ff69b4,
				0 0 20px #ff69b4,
				0 0 30px #ff69b4,
				0 0 40px #ff69b4,
				0 0 70px #ff69b4,
				0 0 80px #ff69b4,
				0 0 90px #ff69b4,
				0 0 100px #ff69b4;
			color: #ff69b4; /* Neon pink color */
		}
		100% {
			text-shadow: none;
			color: #fff;
		}
	}

	h1 {
		font-size: 36px;
		animation: neon 1.5s infinite alternate; /* Aplicar animación de colores neon */
	}

	.question {
		margin-top: 40px;
	}

	.form-group {
		margin-top: 20px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		font-weight: bold;
	}

	.form-control {
		width: 100%;
		padding: 10px;
		margin-bottom: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
	}

	button {
		padding: 10px 20px;
		background-color: #ffd700; /* Gold color for button */
		color: #222; /* Dark text color for button */
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button:hover {
		background-color: #ffa500; /* Orange color on hover */
	}

	#temporizador {
		font-size: 24px;
		margin-top: 20px;
		color: #f44336; /* Red color for timer */
	}

	.question-container {
		margin-top: 40px;
	}

	#pregunta {
		font-size: 28px;
		color: #fff;
	}

	.answers {
		list-style: none;
		padding: 0;
	}

	.answers li {
		margin-bottom: 10px;
	}

	.answers li button {
		padding: 10px 20px;
		background-color: #008cba; /* Blue color for answer buttons */
		color: #fff;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.answers li button:hover {
		background-color: #005f75; /* Darker blue on hover */
	}

	@keyframes moveUsers {
		0% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(-10px);
		}
		100% {
			transform: translateX(0);
		}
	}

	#usuarios {
		animation: moveUsers 2s infinite; /* Users animation */
	}

	@keyframes slideIn {
		0% {
			opacity: 0;
			transform: translateY(100%);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	#resultados {
		animation: slideIn 5s ease forwards;
	}

	#resultados {
		border-collapse: collapse;
		width: 100%;
		margin-bottom: 20px;
	}

	#resultados th,
	#resultados td {
		border: 1px solid #ddd;
		padding: 8px;
		text-align: left;
	}

	#resultados th {
		background-color: #f2f2f2;
	}

	#resultados tr:nth-child(even) {
		background-color: #f2f2f2;
	}

	#resultados tr:hover {
		background-color: #ddd;
	}

	#resultados a {
		display: block;
		margin-top: 20px;
		text-align: center;
		color: blue;
	}

	#resultados a:hover {
		text-decoration: underline;
	}
</style>
