document.addEventListener("DOMContentLoaded", () => {
    const formularioPregunta = document.getElementById("formulario-pregunta");
    const preguntaInput = document.getElementById("pregunta");
    const listaPreguntasCliente = document.getElementById("lista-preguntas");

    function obtenerPreguntas() {
        return JSON.parse(localStorage.getItem("preguntas")) || [];
    }

    function mostrarPreguntasCliente() {
        const preguntas = obtenerPreguntas();
        listaPreguntasCliente.innerHTML = "";
        preguntas.forEach((pregunta) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <p><strong>Pregunta:</strong> ${pregunta.texto}</p>
                <p><strong>Respuesta:</strong> ${pregunta.respuesta ? pregunta.respuesta : "Aún sin respuesta"}</p>
            `;
            listaPreguntasCliente.appendChild(li);
        });
    }

    formularioPregunta.addEventListener("submit", (event) => {
        event.preventDefault();
        const nuevaPregunta = preguntaInput.value.trim();
        const nombreCliente = localStorage.getItem("nombreUsuario") || "Cliente Anónimo";

        if (nuevaPregunta === "") {
            alert("Por favor, escribe una pregunta.");
            return;
        }

        let preguntas = obtenerPreguntas();
        preguntas.push({ nombre: nombreCliente, texto: nuevaPregunta, respuesta: null });
        localStorage.setItem("preguntas", JSON.stringify(preguntas));

        preguntaInput.value = "";
        mostrarPreguntasCliente();
    });

    // Actualizar respuestas automáticamente cada 3 segundos
    setInterval(() => {
        mostrarPreguntasCliente();
    }, 3000);

    // Cargar preguntas al inicio
    mostrarPreguntasCliente();
});
