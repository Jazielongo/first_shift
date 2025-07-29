// Espera a que el DOM cargue completamente
document.addEventListener("DOMContentLoaded", () => {
    const popupToggle = document.querySelector(".popup-toggle");
    const popup = document.getElementById("popup");

    // Mostrar la ventana al hacer click en el ícono
    popupToggle.addEventListener("click", () => {
        popup.style.display = "flex";
        setTimeout(() => {
            popup.classList.add("show");
        }, 10); // Delay para que active la transición
    });

    // Ocultar ventana al hacer click fuera del contenido
    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.classList.remove("show")
            setTimeout(() => {
                popup.style.display = "none";
            }, 300); // Espera a que termine la animación
        }
    });
});

// Toggle listas desplegables con animación y flechita
document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const section = btn.closest(".activity-section");
        section.classList.toggle("open");
    });
});

// Funcionalidad para cargar contenido de prácticas al hacer clic
document.querySelectorAll(".activity-list li").forEach((item) => {
    item.addEventListener("click", () => {
        const title = item.textContent;
        const description = `Esta es una descripción ficticia para la práctica "${title}". Aquí el practicante podrá entender de qué trata antes de comenzar.`;

        // Ocultar mensaje inicial
        document.getElementById("placeholder").style.display = "none";

        // Mostrar contenido
        const content = document.getElementById("practice-content");
        content.classList.remove("hidden");

        // Reinicia la animación
        content.style.animation = "none";
        void content.offsetWidth; // truco para reiniciar la animación
        content.style.animation = null;

        // Mostramos el botón al seleccionar una práctica
        document.getElementById("start-btn").classList.remove("hidden");
        const startBtn = document.getElementById("start-btn");
        startBtn.classList.remove("hidden");
        startBtn.classList.remove("fade-in-up");
        void startBtn.offsetWidth;
        startBtn.classList.add("fade-in-up")

        // Insertar contenido
        document.getElementById("practice-title").textContent = title;
        document.getElementById("practice-description").textContent = description;
    });
});

// Funcionalidad de botón Comenzar
document.getElementById("start-btn").addEventListener("click", () => {
    // Ocultar información de la práctica
    document.getElementById("practice-content").classList.add("hidden");
    document.getElementById("start-btn").classList.add("hidden");

    // Mostrar barra de acciones
    document.getElementById("bottom-bar").classList.remove("hidden");

    // Animar ocultación de columna lateral
    const sidebar = document.querySelector(".left-sidebar");
    sidebar.classList.add("slide-out");

    // Expande main-content suavemente (suavementeeeeeeeee besameeeeeeee, yo quiero sentir tus labios besandome otra veeeez)
    document.getElementById("main-container").style.gap = "0";
    const mainContent = document.querySelector(".main-content");
    mainContent.classList.add("expand");

    // Mostrar barra inferior con animación
    const bar = document.getElementById("bottom-bar");
    bar.classList.remove("hidden");
    void bar.offsetWidth;
    bar.classList.add("slide-in");
});

// Funcionalidad botón Salir con animación inversa
document.getElementById("exit-practice-btn").addEventListener("click", () => {
    const sidebar = document.querySelector(".left-sidebar");
    const mainContent = document.querySelector(".main-content");
    const mainContainer = document.getElementById("main-container");
    const bottomBar = document.getElementById("bottom-bar");

    // Animar regreso de columna lateral
    sidebar.classList.remove("slide-out");

    // Restaurar tamaño original del contenido
    mainContent.classList.remove("expand");
    mainContainer.style.gap = "1.5rem";

    // Ocultar barra inferior con animación
    bottomBar.classList.remove("slide-in");
    bottomBar.classList.add("slide-out");

    // Esperar la animación antes de ocultar realmente la barra
    setTimeout(() => {
        bottomBar.classList.add("hidden");
        bottomBar.classList.remove("slide-out");
    }, 300); // duración de la animación
    
    // Mostrar mensaje inicial otra vez
    document.getElementById("placeholder").style.display = "block";

    // Ocultar contenido de práctica y botón
    document.getElementById("practice-content").classList.add("hidden");
    document.getElementById("start-btn").classList.add("hidden");

});

// Funcionalidad barra de herramientas
const toolsBtn = document.getElementById("tools-btn");
const toolBar = document.getElementById("tool-bar");
toolsBtn.addEventListener("click", () => {
    toolBar.classList.toggle("show");
});

document.addEventListener("click", (event) => {
    const isClickInsideBar = toolBar.contains(event.target);
    const isClickOnButton = toolsBtn.contains(event.target);

    if (!isClickInsideBar && !isClickOnButton) {
        toolBar.classList.remove("show");
    }
});

// Animaciones de caja de respuestas
document.querySelectorAll(".answer-box").forEach(box => {
    box.addEventListener("click", () => {
        box.classList.add("clicked");

        // Quitar la clase después de la animación para permitir múltiples clics
        setTimeout(() => {
            box.classList.remove("clicked");
        }, 200);
    });
});