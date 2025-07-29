function validateLogin() {
    const userIdentifier = document.getElementById("user-identifier").value;
    const password = document.getElementById("password").value;

    if (userIdentifier.trim() === "") {
        alert("Por favor, ingresa tu usuario, teléfono o correo electrónico.");
        return false;
    }

    if (password.trim() === "") {
        alert("Por favor, ingresa tu contraseña.");
        return false;
    }

    // Si la autenticación es exitosa, podrías redirigir al usuario:
    // window.location.href = "dashboard.html"; // Por ejemplo, a un panel de control

    return true;
}

// Hacer la función global para que pueda ser llamada desde onsubmit en el HTML
window.validateLogin = validateLogin;