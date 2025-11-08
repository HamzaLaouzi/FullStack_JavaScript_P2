import * as almacenaje from "./almacenaje.js";
import * as crudVoluntariados from "./int_3_voluntariados.js";

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

document.addEventListener("DOMContentLoaded", async () => {
    mostrarUsuarioActivo();
    crudVoluntariados.mostrarVoluntariados();
    crudVoluntariados.formConnect();
    crudVoluntariados.dibujarGrafico();
});