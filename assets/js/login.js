import * as almacenaje from "./almacenaje.js";

/* Mostrar el usuario activo ---------------------------------------------------*/
function mostrarUsuarioActivo() {
    const logged = document.getElementById("usuarioActivo");
    const usuarioActivo = almacenaje.obtenerUsuarioActivo();

    if (usuarioActivo) {
        logged.textContent = usuarioActivo;
        logged.classList.remove("disabled");
        logged.removeAttribute("aria-disabled");
    } else {
        logged.textContent = "no logged";
        logged.classList.add("disabled");
        logged.setAttribute("aria-disabled", "true");
    }
}

/* Login -----------------------------------------------------------------------*/
async function loguearUsuario(event) {
    event.preventDefault();

    const email = document.getElementById("inputEmail").value.trim();
    const contraseña = document.getElementById("inputContraseña").value.trim();
    const loginCorrecto = almacenaje.loguearUsuario(email, contraseña);
    /* Login pasado al modulo de almacenaje */

    if (loginCorrecto) {
        alert("Sesión iniciada correctamente");
        mostrarUsuarioActivo();
        event.target.reset();
    } else {
        alert("Los datos de inicio de sesión son incorrectos");
    }
}

/* Arranque -------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuarioActivo();

    /*listener login*/
    const form = document.querySelector("#login form");
    if (form) {
        form.addEventListener("submit", loguearUsuario);
    }
});