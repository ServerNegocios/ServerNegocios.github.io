document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.getElementById("productos");
    const listaCarrito = document.getElementById("lista-carrito");
    const totalCarrito = document.getElementById("total-carrito");
    const botonPedido = document.getElementById("realizar-pedido");
    const botonAnterior = document.getElementById("anterior");
    const botonSiguiente = document.getElementById("siguiente");

    let carrito = [];
    let paginaActual = 0;
    const productosPorPagina = 3;

    const productos = [
        { id: 1, nombre: "Ventilador", precio: 50, imagen: "img/Ventilador.jpg" },
        { id: 2, nombre: "Split", precio: 420, imagen: "img/Split.jpg" },
        
    ];

    function mostrarProductos() {
        contenedorProductos.innerHTML = "";
        let inicio = paginaActual * productosPorPagina;
        let fin = inicio + productosPorPagina;
        let productosPagina = productos.slice(inicio, fin);

        productosPagina.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 150px; height: auto;">
                <h2 style="color: black;">${producto.nombre}</h2>
                <p>Precio: $${producto.precio}</p>
                <button onclick="agregarAlCarrito(${producto.id})">Añadir al Carrito</button>
            `;
            contenedorProductos.appendChild(div);
        });

        botonAnterior.style.display = paginaActual > 0 ? "inline-block" : "none";
        botonSiguiente.style.display = fin < productos.length ? "inline-block" : "none";
    }

    botonAnterior.addEventListener("click", () => {
        if (paginaActual > 0) {
            paginaActual--;
            mostrarProductos();
        }
    });

    botonSiguiente.addEventListener("click", () => {
        if ((paginaActual + 1) * productosPorPagina < productos.length) {
            paginaActual++;
            mostrarProductos();
        }
    });

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

        totalCarrito.textContent = `Total: $${total}`;
    }

    window.quitarDelCarrito = (index) => {
        carrito.splice(index, 1);
        actualizarCarrito();
    };

    botonPedido.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("El carrito está vacío.");
            return;
        }
    
        // Obtener datos del usuario desde localStorage (o cualquier otro sistema de autenticación)
        let nombreCliente = localStorage.getItem("nombreUsuario") || prompt("Por favor, ingrese su nombre:");
        let carnetCliente = localStorage.getItem("carnetUsuario") || prompt("Por favor, ingrese su carnet:");
    
        if (!nombreCliente || nombreCliente.trim() === "" || !carnetCliente || carnetCliente.trim() === "") {
            alert("⚠️ Debe ingresar un nombre y carnet para continuar con el pedido.");
            return;
        }
    
        // Construir el resumen del pedido
        let totalPedido = carrito.reduce((sum, p) => sum + p.precio, 0);
        let mensaje = `🛒 **Resumen del Pedido**\n\n👤 **Cliente**: ${nombreCliente}\n🆔 **Carnet**: ${carnetCliente}\n\n`;
    
        carrito.forEach(p => {
            mensaje += `- ${p.nombre}: $${p.precio}\n`;
        });
    
        mensaje += `\n💰 **Total a Pagar**: $${totalPedido}\n`;
        mensaje += `📦 **Método de Entrega**: Recoger en tienda\n`;
        mensaje += `📍 **Dirección**: Calle E entre Avenida y 3ra #116. Reparto Sueño\n\n`;
        mensaje += `❓ ¿Desea confirmar este pedido?`;
    
        // Preguntar antes de procesar
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
            metodoEntrega: "Recoger en tienda",
            direccion: "Calle E entre Avenida y 3ra #116. Reparto Sueño"
        };
    
        // Enviar pedido al servidor
        fetch("http://localhost:3000/guardar_pedido", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Pedido guardado:", data);
            alert(`✅ ¡Pedido de ${categoria} realizado con éxito! Gracias, ${nombreCliente}!`);
            carrito = [];
            actualizarCarrito();
        })
        .catch(error => {
            console.error("Error al guardar pedido:", error);
            alert("⚠️ Hubo un problema al guardar el pedido.");
        });
    });
    

    
    mostrarProductos();
});
