const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

const archivos = {
    Alimentos: "pedidos_alimentos.json",
    Electrodomésticos: "pedidos_electrodomesticos.json"
};

// Función para guardar pedidos en archivos JSON
function guardarPedido(pedido) {
    const archivo = archivos[pedido.categoria] || "pedidos_generales.json";

    let pedidos = [];
    if (fs.existsSync(archivo)) {
        const data = fs.readFileSync(archivo);
        pedidos = JSON.parse(data);
    }

    pedidos.push(pedido);
    fs.writeFileSync(archivo, JSON.stringify(pedidos, null, 2));
    console.log(`✅ Pedido de ${pedido.categoria} guardado en ${archivo}`);
}

// Ruta para recibir pedidos
app.post("/guardar_pedido", (req, res) => {
    const pedido = req.body;

    if (!pedido.categoria || !pedido.productos || !pedido.total) {
        return res.status(400).json({ error: "Datos incompletos" });
    }

    guardarPedido(pedido);
    res.json({ mensaje: `Pedido de ${pedido.categoria} guardado correctamente`, pedido });
});

// Ruta para obtener pedidos de alimentos
app.get("/pedidos_alimentos", (req, res) => {
    if (fs.existsSync(archivos.Alimentos)) {
        const data = fs.readFileSync(archivos.Alimentos);
        res.json(JSON.parse(data));
    } else {
        res.json([]);
    }
});

// Ruta para obtener pedidos de electrodomésticos
app.get("/pedidos_electrodomesticos", (req, res) => {
    if (fs.existsSync(archivos.Electrodomésticos)) {
        const data = fs.readFileSync(archivos.Electrodomésticos);
        res.json(JSON.parse(data));
    } else {
        res.json([]);
    }
});

app.listen(3000, () => {
    console.log("🖥 Servidor ejecutándose en http://localhost:3000");
});
