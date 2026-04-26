// ============================================
// REGISTRAR USUARIO (registro.html)
// ============================================

// Función para registrar un nuevo usuario
function registrarUsuario() {
    // Obtener los valores de los campos del formulario
    let nombre = document.getElementById("nombreUsuario").value.trim();
    let email = document.getElementById("emailUsuario").value.trim();
    let password = document.getElementById("passwordUsuario").value;
    let mensaje = document.getElementById("mensaje");

    // Validar que todos los campos estén llenos
    if (!nombre || !email || !password) {
        mensaje.textContent = "Todos los campos son obligatorios";
        return; // Salir si hay campos vacíos
    }

    // Obtener la lista de usuarios existentes desde localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verificar si el email ya está registrado
    let existe = usuarios.some(u => u.email === email);

    // Si el email ya existe, mostrar error
    if (existe) {
        mensaje.textContent = "Este correo ya está registrado";
        return;
    }

    // Crear un nuevo objeto usuario con ID único
    let nuevoUsuario = {
        id: Date.now(), // ID único basado en la fecha actual
        nombre,
        email,
        password
    };

    // Agregar el nuevo usuario al array
    usuarios.push(nuevoUsuario);

    // Guardar el array actualizado en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Mostrar mensaje de éxito
    mensaje.textContent = "Usuario registrado correctamente";

    // Limpiar los campos del formulario
    document.getElementById("nombreUsuario").value = "";
    document.getElementById("emailUsuario").value = "";
    document.getElementById("passwordUsuario").value = "";
}

// ============================================
// IR A LOGIN
// ============================================

// Función para volver a la página de login
function irLogin() {
    // Redireccionar a la página de login
    window.location.href = "login.html";
}


