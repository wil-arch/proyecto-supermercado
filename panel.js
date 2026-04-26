// ============================================
// VERIFICACIÓN DE SESIÓN
// ============================================
let usuario = JSON.parse(localStorage.getItem("sesionActiva"));

if (!usuario) {
    window.location.href = "login.html";
} else {
    document.getElementById("bienvenida").textContent =
        "Bienvenido " + usuario.nombre + " 👋";
}

let editandoId = null;

// ============================================
// GUARDAR PRODUCTO
// ============================================
function guardarProducto() {
    let nombre = document.getElementById("producto").value.trim();
    let cantidad = document.getElementById("cantidad").value;
    let precio = document.getElementById("precio").value;
    let mensaje = document.getElementById("mensaje");

    if (!nombre || !cantidad || !precio) {
        mensaje.textContent = "⚠️ Completa todos los campos";
        return;
    }

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    if (editandoId) {
        productos = productos.map(p => {
            if (p.id == editandoId) {
                return { id: editandoId, nombre, cantidad, precio };
            }
            return p;
        });
        mensaje.textContent = "✏️ Producto actualizado";
        editandoId = null;
    } else {
        let nuevoProducto = {
            id: Date.now(),
            nombre,
            cantidad,
            precio
        };
        productos.push(nuevoProducto);
        mensaje.textContent = "✅ Producto agregado";
    }

    localStorage.setItem("productos", JSON.stringify(productos));
    limpiarFormulario();
    mostrarProductos();
}

// ============================================
// MOSTRAR PRODUCTOS
// ============================================
function mostrarProductos() {
    let lista = document.getElementById("listaProductos");
    let total = document.getElementById("totalProductos");
    let totalValor = document.getElementById("totalValor");

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    lista.innerHTML = "";
    total.textContent = productos.length;

    let suma = 0;

    if (productos.length === 0) {
        lista.innerHTML = "<li>No hay productos</li>";
        totalValor.textContent = "0";
        return;
    }

    productos.forEach(p => {
        suma += p.cantidad * p.precio;
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>${p.nombre}</strong><br>
            Cantidad: ${p.cantidad}<br>
            💲 Precio: $${p.precio}
            <div>
                <button onclick="editarProducto(${p.id})">Editar</button>
                <button onclick="eliminarProducto(${p.id})">Eliminar</button>
            </div>
        `;
        lista.appendChild(li);
    });

    totalValor.textContent = suma;
}

// ============================================
// EDITAR PRODUCTO
// ============================================
function editarProducto(id) {
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id == id);

    document.getElementById("producto").value = producto.nombre;
    document.getElementById("cantidad").value = producto.cantidad;
    document.getElementById("precio").value = producto.precio;

    editandoId = id;
}

// ============================================
// ELIMINAR PRODUCTO
// ============================================
function eliminarProducto(id) {
    if (!confirm("¿Eliminar producto?")) return;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos = productos.filter(p => p.id != id);

    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
}

// ============================================
// BUSCAR PRODUCTO
// ============================================
function buscarProducto() {
    let texto = document.getElementById("buscador").value.toLowerCase();
    let items = document.querySelectorAll("#listaProductos li");

    items.forEach(item => {
        let contenido = item.textContent.toLowerCase();
        item.style.display = contenido.includes(texto) ? "block" : "none";
    });
}

// ============================================
// LIMPIAR FORMULARIO
// ============================================
function limpiarFormulario() {
    document.getElementById("producto").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("precio").value = "";
}

// ============================================
// CERRAR SESIÓN
// ============================================
function cerrarSesion() {
    localStorage.removeItem("sesionActiva");
    window.location.href = "login.html";
}

// ============================================
// INICIAR
// ============================================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mostrarProductos);
} else {
    mostrarProductos();
}