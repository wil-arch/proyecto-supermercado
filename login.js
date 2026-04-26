// ============================================
// FUNCION DE LOGIN (login.html)
// ============================================

// Función para iniciar sesión en el sistema
function login() {
    // Obtener los valores de los campos del formulario
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let mensaje = document.getElementById("mensaje");

    // Obtener la lista de usuarios registrados desde localStorage
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Buscar un usuario que coincida con el email y password ingresados
    let usuario = usuarios.find(u =>
        u.email === email && u.password === password
    );

    // Si encuentra el usuario, iniciar sesión
    if (usuario) {
        // Guardar la sesión activa en localStorage
        localStorage.setItem("sesionActiva", JSON.stringify(usuario));
        
        // Mostrar mensaje de bienvenida
        mensaje.textContent = "Bienvenido " + usuario.nombre;

        // Redireccionar al panel después de 1 segundo (1000 ms)
        setTimeout(() => {
            window.location.href = "panel.html";
        }, 1000);

    } else {
        // Si no encuentra el usuario, mostrar error
        mensaje.textContent = "Credenciales incorrectas";
    }
}

// ============================================
// IR A REGISTRO
// ============================================

// Función para ir a la página de registro
function irRegistro() {
    // Redireccionar a la página de registro
    window.location.href = "registro.html";
}
