document.addEventListener("DOMContentLoaded", () => {
    const loginContainer = document.getElementById("login-container");
    const appContainer = document.getElementById("app");
    const nombreUsuarioInput = document.getElementById("nombre-usuario");
    const carnetUsuarioInput = document.getElementById("carnet-usuario");
    const btnIngresar = document.getElementById("btn-ingresar");
    const btnSalir = document.getElementById("btn-salir");
    const usuarioNombreSpan = document.getElementById("usuario-nombre");
    const usuarioCarnetSpan = document.getElementById("usuario-carnet");
    const menuLista = document.getElementById("menu-lista");

    // Verifica si hay datos guardados en localStorage
    const usuarioGuardado = localStorage.getItem("nombreUsuario");
    const carnetGuardado = localStorage.getItem("carnetUsuario");
    const rolGuardado = localStorage.getItem("rolUsuario");

    if (usuarioGuardado && carnetGuardado && rolGuardado) {
        mostrarTienda(usuarioGuardado, carnetGuardado, rolGuardado);
    }

    // Evento para iniciar sesión
    btnIngresar.addEventListener("click", () => {
        const nombreUsuario = nombreUsuarioInput.value.trim();
        const carnetUsuario = carnetUsuarioInput.value.trim();
        let rolUsuario = "";

        if (nombreUsuario === "" || carnetUsuario === "") {
            alert("Por favor, ingrese su nombre y número de carnet.");
            return;
        }

        if (carnetUsuario === "04121981226") {
            rolUsuario = "Administrador";
        } else if (carnetUsuario.length === 11 && !isNaN(carnetUsuario)) {
            rolUsuario = "Cliente";
        } else {
            alert("El número de carnet debe ser 11 dígitos numéricos.");
            return;
        }

        // Guardar datos en localStorage
        localStorage.setItem("nombreUsuario", nombreUsuario);
        localStorage.setItem("carnetUsuario", carnetUsuario);
        localStorage.setItem("rolUsuario", rolUsuario);

        // Mostrar la tienda con los datos del usuario y su rol
        mostrarTienda(nombreUsuario, carnetUsuario, rolUsuario);
    });

    // Función para contar preguntas sin responder
    function contarPreguntasPendientes() {
        const preguntas = JSON.parse(localStorage.getItem("preguntas")) || [];
        return preguntas.filter(p => !p.respuesta).length; // Filtra preguntas sin respuesta
    }

    // Función para actualizar la notificación
    function actualizarNotificacion() {
        const notificacion = document.getElementById("notificacion-preguntas");
        if (notificacion) {
            const cantidadPendientes = contarPreguntasPendientes();
            notificacion.textContent = cantidadPendientes;

            // Oculta la notificación si no hay preguntas pendientes
            notificacion.style.display = cantidadPendientes > 0 ? "inline-block" : "none";
        }
    }

    // Función para mostrar la tienda después del inicio de sesión
    function mostrarTienda(nombre, carnet, rol) {
        usuarioNombreSpan.textContent = nombre;
        usuarioCarnetSpan.textContent = carnet;
        loginContainer.style.display = "none"; // Oculta el formulario de login
        appContainer.classList.remove("hidden"); // Muestra la tienda

        // Modificar el menú según el rol del usuario
        if (rol === "Administrador") {
            menuLista.innerHTML = `
                <li><a href="indexAlimentos.html">🍔 Alimentos</a></li>
                <li><a href="indexElectronico.html">🔌 Equipos Electrodomésticos</a></li>
                <li id="menu-administracion">
                    <a href="indexPanelAdministracion.html">⚙️ Panel Administración</a>
                    <ul class="submenu"> <!-- Submenú --> <a 
                      <li><a href="indexPanelAdministracion.html">❓ Atención al cliente</a></li>
                    <span id="notificacion-preguntas" class="notificacion">0</span>
                    <li><a href="indexAcercaTienda.html">📜 Acerca de la Tienda</a></li>
                    <li><a href="indexBaseDatos.html">📊 Base de Datos</a></li>
                    </ul>
                </li>
                
            `;

            // Actualizar notificación cada 5 segundos para verificar nuevas preguntas
            setInterval(actualizarNotificacion, 5000);
            actualizarNotificacion(); // Llamado inicial
        } else {
            menuLista.innerHTML = `
                <li><a href="indexAlimentos.html">🍔 Alimentos</a></li>
                <li><a href="indexElectronico.html">🔌 Equipos Electrodomésticos</a></li>
                 <li><a href="indexPreguntas.html">❓ Atención al cliente</a></li>
                <li><a href="indexAcercaTienda.html">📜 Acerca de la Tienda</a></li>
               
            `;
        }
    }

    // Evento para cerrar sesión
    btnSalir.addEventListener("click", () => {
        localStorage.removeItem("nombreUsuario");
        localStorage.removeItem("carnetUsuario");
        localStorage.removeItem("rolUsuario");
        location.reload(); // Recarga la página para volver al login
    });
});
