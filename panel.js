// ============================================
// VERIFICACIÓN DE SESIÓN
// ============================================
let usuario = JSON.parse(localStorage.getItem("sesionActiva"));

if (!usuario) {
    window.location.href = "login.html";
} else {
    document.getElementById("bienvenida").textContent =
        "Bienvenido " + usuario.nombre + " 🔐";
}

let editandoId = null;

function esAdministrador() {
    return usuario && usuario.rol === "administrador";
}

function mostrarControlesPorRol() {
    const seccionAdmin = document.getElementById("seccionAdmin");
    const seccionUsuario = document.getElementById("seccionUsuario");

    if (esAdministrador()) {
        seccionAdmin.style.display = "block";
        seccionUsuario.style.display = "none";
    } else {
        seccionAdmin.style.display = "none";
        seccionUsuario.style.display = "block";
        document.getElementById("mensajeUsuario").textContent =
            "Modo usuario: solo puedes comprar (sin editar ni eliminar).";
    }
}

// ============================================
// GUARDAR PRODUCTO (solo admin)
// ============================================
function guardarProducto() {
    if (!esAdministrador()) return;

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

        const accionesAdmin = esAdministrador()
            ? `
                <div>
                    <button onclick="editarProducto(${p.id})">Editar</button>
                    <button onclick="eliminarProducto(${p.id})">Eliminar</button>
                </div>
              `
            : `
                <div>
                    <button onclick="comprarProducto(${p.id})">Comprar</button>
                </div>
              `;

        li.innerHTML = `
            <strong>${p.nombre}</strong><br>
            Cantidad: ${p.cantidad}<br>
            📲 Precio: $${p.precio}
            ${accionesAdmin}
        `;
        lista.appendChild(li);
    });

    totalValor.textContent = suma;
}

// ============================================
// EDITAR PRODUCTO (solo admin)
// ============================================
function editarProducto(id) {
    if (!esAdministrador()) return;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id == id);

    document.getElementById("producto").value = producto.nombre;
    document.getElementById("cantidad").value = producto.cantidad;
    document.getElementById("precio").value = producto.precio;

    editandoId = id;
}

// ============================================
// ELIMINAR PRODUCTO (solo admin)
// ============================================
function eliminarProducto(id) {
    if (!esAdministrador()) return;

    if (!confirm("¿Eliminar producto?")) return;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos = productos.filter(p => p.id != id);

    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductos();
}

// ============================================
// COMPRAR PRODUCTO (usuario/admin, sin edición)
// - Para simplificar: reduce la cantidad en 1.
// ============================================
function comprarProducto(id) {
    if (!usuario) return;

    // Tanto usuario como admin pueden comprar; pero el usuario no puede editar/eliminar.
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id == id);
    if (!producto) return;

    let cantidadActual = Number(producto.cantidad);
    if (Number.isNaN(cantidadActual) || cantidadActual <= 0) return;

    cantidadActual -= 1;

    if (cantidadActual <= 0) {
        productos = productos.filter(p => p.id != id);
    } else {
        productos = productos.map(p => {
            if (p.id == id) return { ...p, cantidad: cantidadActual };
            return p;
        });
    }

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
// LIMPIAR FORMULARIO (solo admin)
// ============================================
function limpiarFormulario() {
    if (!esAdministrador()) return;

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
    document.addEventListener("DOMContentLoaded", () => {
        mostrarControlesPorRol();
        mostrarProductos();
    });
} else {
    mostrarControlesPorRol();
    mostrarProductos();
}

