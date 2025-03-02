document.addEventListener("DOMContentLoaded", () => {
    const listaPreguntasAdmin = document.getElementById("lista-preguntas-admin");
    let respuestasTemporales = {}; // Guardar respuestas en curso

    function obtenerPreguntas() {
        return JSON.parse(localStorage.getItem("preguntas")) || [];
    }

    function mostrarPreguntas() {
        const preguntas = obtenerPreguntas();
        listaPreguntasAdmin.innerHTML = "";

        preguntas.forEach((pregunta, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <p><strong>Cliente:</strong> ${pregunta.nombre}</p>
                <p><strong>Pregunta:</strong> ${pregunta.texto}</p>
                ${pregunta.respuesta ? `<p><strong>Respuesta:</strong> ${pregunta.respuesta}</p>` : ""}
                <textarea id="respuesta-${index}" placeholder="Escribe tu respuesta aquí...">${respuestasTemporales[index] !== undefined ? respuestasTemporales[index] : ""}</textarea>
                <button onclick="responderPregunta(${index})">Responder</button>
                <button onclick="eliminarPregunta(${index})" style="background-color: red; color: white; margin-left: 10px;">Eliminar</button>
            `;
            listaPreguntasAdmin.appendChild(li);

            // Detectar cambios en cada textarea y guardarlos en respuestasTemporales
            const textarea = document.getElementById(`respuesta-${index}`);
            textarea.addEventListener("input", () => {
                respuestasTemporales[index] = textarea.value; // Guarda correctamente los valores vacíos
            });
        });
    }

    window.responderPregunta = function (index) {
        let preguntas = obtenerPreguntas();
        const respuestaTexto = respuestasTemporales[index]?.trim() || ""; // Permitir respuestas vacías

        preguntas[index].respuesta = respuestaTexto;
        localStorage.setItem("preguntas", JSON.stringify(preguntas));

        // Eliminar la respuesta temporal después de enviarla
        delete respuestasTemporales[index];

        // Actualizar la lista inmediatamente
        mostrarPreguntas();
    };

    window.eliminarPregunta = function (index) {
        if (confirm("¿Estás seguro de eliminar esta pregunta?")) {
            let preguntas = obtenerPreguntas();
            preguntas.splice(index, 1);
            localStorage.setItem("preguntas", JSON.stringify(preguntas));

            // Eliminar la respuesta temporal asociada
            delete respuestasTemporales[index];

            mostrarPreguntas();
        }
    };

    // Solo actualizar la lista cuando el administrador realice una acción
    mostrarPreguntas();
});
