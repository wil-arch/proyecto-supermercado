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

function esAdministrador() {
    return usuario && usuario.rol === "administrador";
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Carrito: para usuarios (y opcional para admin) se guarda en localStorage.
// Cada item: { productoId, nombre, precioUnitario, cantidad }
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function limpiarCarritoUI() {
    let lista = document.getElementById("listaProductosUsuario");
    if (!lista) return;
    lista.innerHTML = "";
}

function mostrarCarritoUsuario() {
    // Solo usuarios (no admin)
    if (esAdministrador()) return;

    let lista = document.getElementById("listaProductosUsuario");
    let totalProductos = document.getElementById("totalProductosUsuario");
    let totalPrecio = document.getElementById("totalPrecioUsuario");

    if (!lista || !totalProductos || !totalPrecio) return;

    lista.innerHTML = "";

    let totalItems = 0;
    let totalSum = 0;

    if (!carrito || carrito.length === 0) {
        lista.innerHTML = "<li>Tu carrito está vacío</li>";
        totalProductos.textContent = "0";
        totalPrecio.textContent = "0";
        return;
    }

    carrito.forEach(item => {
        totalItems += Number(item.cantidad) || 0;
        totalSum += (Number(item.cantidad) || 0) * (Number(item.precioUnitario) || 0);

        let li = document.createElement("li");
        li.innerHTML = `
            <strong>${item.nombre}</strong><br>
            Cantidad: ${item.cantidad}<br>
            💲 Precio Unitario: $${item.precioUnitario}<br>
            🧾 Precio Total: $${(Number(item.cantidad) || 0) * (Number(item.precioUnitario) || 0)}
            <div>
                <button onclick="eliminarDelCarrito(${item.productoId})">Quitar</button>
            </div>
        `;
        lista.appendChild(li);
    });

    totalProductos.textContent = totalItems;
    totalPrecio.textContent = totalSum;
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
            "Disfruta de tus compras 🛒";
    }
}

// ============================================
// ADMIN: GUARDAR PRODUCTO (CRUD inventario)
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
    mostrarInventarioAdmin();
}

function limpiarFormulario() {
    if (!esAdministrador()) return;

    document.getElementById("producto").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("precio").value = "";
}

function mostrarInventarioAdmin() {
    // Admin: muestra inventario completo (incluye cantidad)
    let lista = document.getElementById("listaProductos");
    let total = document.getElementById("totalProductos");
    let totalValor = document.getElementById("totalValor");

    if (!lista || !total || !totalValor) return;

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

function editarProducto(id) {
    if (!esAdministrador()) return;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id == id);

    document.getElementById("producto").value = producto.nombre;
    document.getElementById("cantidad").value = producto.cantidad;
    document.getElementById("precio").value = producto.precio;

    editandoId = id;
}

function eliminarProducto(id) {
    if (!esAdministrador()) return;
    if (!confirm("¿Eliminar producto?")) return;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos = productos.filter(p => p.id != id);

    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarInventarioAdmin();
    // Si un producto se eliminó, también lo quitamos del carrito.
    carrito = (JSON.parse(localStorage.getItem("carrito")) || [])
        .filter(it => it.productoId != id);
    guardarCarrito();
    mostrarCarritoUsuario();
}

// ============================================
// USUARIO: mostrar catálogo (sin cantidad inventario)
// y comprar => se agrega a su carrito
// ============================================
function mostrarCatalogoUsuario() {
    let lista = document.getElementById("listaProductos");
    let total = document.getElementById("totalProductos");
    let totalValor = document.getElementById("totalValor");

    if (!lista || !total || !totalValor) return;

    let productos = JSON.parse(localStorage.getItem("productos")) || [];

    lista.innerHTML = "";

    // En usuario: ocultamos métricas de inventario (cantidad y valor del inventario)
    total.textContent = "0";
    totalValor.textContent = "0";

    if (productos.length === 0) {
        lista.innerHTML = "<li>No hay productos disponibles</li>";
        return;
    }

    productos.forEach(p => {
        let li = document.createElement("li");
        li.innerHTML = `
            <strong>${p.nombre}</strong><br>
            💲 Precio: $${p.precio}
            <div>
                <button onclick="comprarProducto(${p.id})">Agregar</button>
            </div>
        `;
        lista.appendChild(li);
    });
}

function comprarProducto(id) {
    if (!usuario) return;

    // Usuario (y admin) agregan al carrito. Pero el admin igual puede modificar inventario.
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id == id);
    if (!producto) return;

    // No mostramos cantidad de inventario al usuario; aun así, validamos que exista.
    if (Number(producto.cantidad) <= 0) return;

    // Agregar al carrito sumando 1
    let item = carrito.find(it => it.productoId == id);
    if (item) {
        item.cantidad = (Number(item.cantidad) || 0) + 1;
    } else {
        carrito.push({
            productoId: id,
            nombre: producto.nombre,
            precioUnitario: producto.precio,
            cantidad: 1
        });
    }

    // Consumir inventario: reduce cantidad en 1
    let cantidadActual = Number(producto.cantidad);
    cantidadActual = cantidadActual - 1;

    if (cantidadActual <= 0) {
        productos = productos.filter(p => p.id != id);
    } else {
        productos = productos.map(p => {
            if (p.id == id) return { ...p, cantidad: cantidadActual };
            return p;
        });
    }

    localStorage.setItem("productos", JSON.stringify(productos));
    guardarCarrito();

    // UI
    if (esAdministrador()) {
        mostrarInventarioAdmin();
    } else {
        mostrarCatalogoUsuario();
        mostrarCarritoUsuario();
    }
}

function eliminarDelCarrito(productoId) {
    if (esAdministrador()) return; // solo usuario

    // 1) Encontrar cantidad del item para revertir al inventario
    let productos = JSON.parse(localStorage.getItem("productos")) || [];
    let producto = productos.find(p => p.id == productoId);
    if (producto) {
        let item = (carrito || []).find(it => it.productoId == productoId);
        let cantidadDevuelta = item ? Number(item.cantidad) || 0 : 0;

        // 2) Sumar de vuelta al inventario (cantidad se resta al comprar)
        if (cantidadDevuelta > 0) {
            let nuevaCantidad = Number(producto.cantidad) + cantidadDevuelta;
            productos = productos.map(p => {
                if (p.id == productoId) return { ...p, cantidad: nuevaCantidad };
                return p;
            });
            localStorage.setItem("productos", JSON.stringify(productos));
        }
    }

    // 3) Quitar del carrito
    carrito = (JSON.parse(localStorage.getItem("carrito")) || [])
        .filter(it => it.productoId != productoId);
    guardarCarrito();

    mostrarCarritoUsuario();
    mostrarCatalogoUsuario();
}


// ============================================
// BUSCAR PRODUCTO (catálogo/lista)
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

        if (esAdministrador()) {
            mostrarInventarioAdmin();
        } else {
            mostrarCatalogoUsuario();
            mostrarCarritoUsuario();
        }
    });
} else {
    mostrarControlesPorRol();

    if (esAdministrador()) {
        mostrarInventarioAdmin();
    } else {
        mostrarCatalogoUsuario();
        mostrarCarritoUsuario();
    }
}

