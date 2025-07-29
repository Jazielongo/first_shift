const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const passwordMatchStatus = document.getElementById("password-match-status");

const len = document.getElementById("len");
const upper = document.getElementById("upper");
const lower = document.getElementById("lower");
const number = document.getElementById("number");
const special = document.getElementById("special");

function updatePasswordRequirements() {
    // Validate length
    if(passwordInput.value.length >= 8) {
        len.classList.remove("invalid");
        len.classList.add("valid");
    } else {
        len.classList.remove("valid");
        len.classList.add("invalid");
    }

    // Validate capital letters
    const upperCaseLetters = /[A-Z]/g;
    if(passwordInput.value.match(upperCaseLetters)) {
        upper.classList.remove("invalid");
        upper.classList.add("valid");
    } else {
        upper.classList.remove("valid");
        upper.classList.add("invalid");
    }

    // Validate lowercase letters
    const lowerCaseLetters = /[a-z]/g;
    if(passwordInput.value.match(lowerCaseLetters)) {
        lower.classList.remove("invalid");
        lower.classList.add("valid");
    } else {
        lower.classList.remove("valid");
        lower.classList.add("invalid");
    }

    // Validate numbers
    const numbers = /[0-9]/g;
    if(passwordInput.value.match(numbers)) {
        number.classList.remove("invalid");
        number.classList.add("valid");
    } else {
        number.classList.remove("valid");
        number.classList.add("invalid");
    }

    // Validate special characters
    const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    if(passwordInput.value.match(specialChars)) {
        special.classList.remove("invalid");
        special.classList.add("valid");
    } else {
        special.classList.remove("valid");
        special.classList.add("invalid");
    }

    checkPasswordsMatch();
}

function checkPasswordsMatch() {
    if (passwordInput.value === confirmPasswordInput.value && confirmPasswordInput.value !== "") {
        passwordMatchStatus.textContent = "Las contraseñas coinciden";
        passwordMatchStatus.style.color = "green";
    } else if (confirmPasswordInput.value !== "") {
        passwordMatchStatus.textContent = "Las contraseñas no coinciden";
        passwordMatchStatus.style.color = "red";
    } else {
        passwordMatchStatus.textContent = "";
    }
}

// Renombrada la función para el formulario de registro
function validateRegisterForm() {
    if (passwordInput.value !== confirmPasswordInput.value) {
        alert("Las contraseñas no coinciden. Por favor, verifícalas.");
        return false;
    }

    const isPasswordValid = len.classList.contains('valid') &&
                            upper.classList.contains('valid') &&
                            lower.classList.contains('valid') &&
                            number.classList.contains('valid') &&
                            special.classList.contains('valid');

    if (!isPasswordValid) {
        alert("La contraseña no cumple con los requisitos de seguridad.");
        return false;
    }
    
    // Aquí puedes redirigir al usuario a una página de confirmación o de inicio de sesión:
    // window.location.href = "login.html";
    return true;
}

passwordInput.addEventListener('keyup', updatePasswordRequirements);
confirmPasswordInput.addEventListener('keyup', checkPasswordsMatch);

// Hacer la función global para que pueda ser llamada desde onsubmit en el HTML
window.validateRegisterForm = validateRegisterForm;