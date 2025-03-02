document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.getElementById("productos");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const checkboxDomicilio = document.getElementById("servicio-domicilio");
    const datosEnvio = document.getElementById("datos-envio");
    const direccionSelect = document.getElementById("direccion-seleccion");
    const direccionExacta = document.getElementById("direccion");
    const telefonoInput = document.getElementById("numero-telefono");
    const botonPedido = document.getElementById("realizar-pedido");

    const botonSiguiente = document.getElementById("siguiente");
    const botonAnterior = document.getElementById("anterior");

    let carrito = [];
    let costoEnvio = 0;
    let paginaActual = 0;
    const productosPorPagina = 2;

    const productos = [
        { id: 1, nombre: "Pelly de Becon", precio: 450, imagen: "img/Becon.jpg" },
        { id: 2, nombre: "Pelly de AJO", precio: 450, imagen: "img/Ajo.jpg" },
        { id: 3, nombre: "Pelly de Chiles Calientes Picantes", precio: 450, imagen: "img/Chiles Calientes Picantes.jpg" },
        { id: 4, nombre: "Pelly de Ketchup", precio: 450, imagen: "img/ketchup.jpg" },
        { id: 5, nombre: "Pelly de Queso Crema", precio: 450, imagen: "img/Queso Crema.jpg" },
        { id: 6, nombre: "Pelly de BBQ", precio: 450, imagen: "img/BBQ.jpg" }
    ];

    function mostrarProductos() {
        contenedorProductos.innerHTML = "";
        let inicio = paginaActual * productosPorPagina;
        let fin = inicio + productosPorPagina;
        let productosPagina = productos.slice(inicio, fin);

        productosPagina.forEach(producto => {
            const div = document.createElement("div");
            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 150px; height: auto;">
                <h2>${producto.nombre}</h2>
                <p>Precio: $${producto.precio}</p>
                <button onclick="agregarAlCarrito(${producto.id})">Añadir al Carrito</button>
            `;
            contenedorProductos.appendChild(div);
        });

        botonAnterior.style.display = paginaActual === 0 ? "none" : "inline-block";
        botonSiguiente.style.display = fin >= productos.length ? "none" : "inline-block";
    }

    window.agregarAlCarrito = (id) => {
        const producto = productos.find(p => p.id === id);
        if (producto) {
            carrito.push({ ...producto });
            actualizarCarrito();
        }
    };

    function actualizarCarrito() {
        listaCarrito.innerHTML = "";
        let total = 0;

        carrito.forEach((producto, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${producto.nombre} - $${producto.precio} 
                <button onclick="quitarDelCarrito(${index})">❌</button>`;
            listaCarrito.appendChild(li);
            total += producto.precio;
        });

        if (costoEnvio > 0) {
            const liEnvio = document.createElement("li");
            liEnvio.textContent = `🚚 Envío: $${costoEnvio}`;
            listaCarrito.appendChild(liEnvio);
        }

        total += costoEnvio;
        totalCarrito.textContent = `Total: $${total}`;
    }

    window.quitarDelCarrito = (index) => {
        carrito.splice(index, 1);
        actualizarCarrito();
    };

    checkboxDomicilio.addEventListener("change", () => {
        if (checkboxDomicilio.checked) {
            datosEnvio.style.display = "block";
        } else {
            datosEnvio.style.display = "none";
            direccionSelect.value = "0";
            direccionExacta.value = "";
            telefonoInput.value = "";
            costoEnvio = 0;
            actualizarCarrito();
        }
    });

    direccionSelect.addEventListener("change", () => {
        let opcion = direccionSelect.value;

        const precios = {
            "Sueño": 150,
            "Plaza de Marte": 200,
            "Quintero": 250,
            "Rajayoja": 350,
            "Alameda": 350,
            "Santa Bárbara": 250,
            "Micro 9": 350,
            "Vista Alegre": 300,
            "Centro de la ciudad": 300,
            "Trocha": 350
        };

        costoEnvio = precios[opcion] || 0;
        actualizarCarrito();
    });

    botonPedido.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }
    
        // Obtener nombre y carnet del cliente desde localStorage
        let nombreCliente = localStorage.getItem("nombreUsuario") || "Usuario no registrado";
        let carnetCliente = localStorage.getItem("carnetUsuario") || "Carnet no proporcionado";
    
        let metodoEntrega = checkboxDomicilio.checked ? "Domicilio" : "Recoger en tienda";
        let direccionEntrega = checkboxDomicilio.checked ? direccionSelect.value + " - " + direccionExacta.value : "Calle E entre Avenida y 3ra #116. Reparto Sueño";
        let telefonoCliente = checkboxDomicilio.checked ? telefonoInput.value : "No proporcionado";
    
        // Calcular total con envío
        let totalPedido = carrito.reduce((sum, p) => sum + p.precio, 0) + costoEnvio;
    
        // Crear resumen del pedido
        let mensaje = `🛒 **Resumen del Pedido**\n\n`;
        mensaje += `👤 **Cliente**: ${nombreCliente}\n`;
        mensaje += `🆔 **Carnet**: ${carnetCliente}\n\n`;
        carrito.forEach(p => {
            mensaje += `- ${p.nombre}: $${p.precio}\n`;
        });
        if (costoEnvio > 0) mensaje += `🚚 Envío: $${costoEnvio}\n`;
        mensaje += `\n📦 **Método de Entrega**: ${metodoEntrega}\n`;
        mensaje += `📍 **Dirección**: ${direccionEntrega}\n`;
        mensaje += `📞 **Teléfono**: ${telefonoCliente}\n`;
        mensaje += `💰 **Total a Pagar**: $${totalPedido}\n\n`;
        mensaje += `¿Desea confirmar este pedido?`;
    
        // Confirmación del usuario
        if (!confirm(mensaje)) {
            return;
        }
    
        // Determinar la categoría del pedido
        let categoria = productos.some(p => p.nombre.includes("Pelly")) ? "Alimentos" : "Electrodomésticos";
    
        let pedido = {
            nombreCliente: nombreCliente,
            carnetCliente: carnetCliente,
            categoria: categoria,
            productos: carrito.map(p => ({ nombre: p.nombre, precio: p.precio })),
            total: totalPedido,
            metodoEntrega: metodoEntrega,
            direccion: direccionEntrega,
            telefono: telefonoCliente
        };
    
        fetch("http://localhost:3000/guardar_pedido", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Pedido guardado:", data);
            alert(`✅ ¡Pedido de ${categoria} realizado con éxito!`);
            carrito = [];
            actualizarCarrito();
        })
        .catch(error => {
            console.error("Error al guardar pedido:", error);
            alert("⚠️ Hubo un problema al guardar el pedido.");
        });
    });
    

    botonSiguiente.addEventListener("click", () => {
        paginaActual++;
        mostrarProductos();
    });

    botonAnterior.addEventListener("click", () => {
        paginaActual--;
        mostrarProductos();
    });

    mostrarProductos();
});
