import * as almacenaje from "./almacenaje.js";

/* MOSTRAR USUARIOS --------------------------------------------------------------------------------------------------*/
export function mostrarUsuarios() {
    const lista = almacenaje.obtenerUsuarios();
    const cont = document.getElementById("lista-usuarios");
    cont.innerHTML = "";

    lista.forEach((u, index) => {
        const fila = document.createElement("div");
        fila.className = "row row-cols-4 border-bottom py-2";
        fila.innerHTML = `
            <div class="col">${u.nombre}</div>
            <div class="col">${u.email}</div>
            <div class="col">${u.contraseña || u.password}</div>
            <div class="col text-center">
                <button class="btn btn-danger btn-sm" data-index="${index}">Borrar</button>
            </div>
        `;
        cont.appendChild(fila);
    });

    document.querySelectorAll("[data-index]").forEach(btn => {
        btn.addEventListener("click", () => eliminarUsuario(btn.dataset.index));
    });
}

/* ELIMINAR USUARIOS --------------------------------------------------------------------------------------------------*/
function eliminarUsuario(indice) {
    const lista = almacenaje.obtenerUsuarios();
    lista.splice(indice, 1);
    almacenaje.guardarUsuarios(lista);
    mostrarUsuarios();
}

/* CREAR USUARIOS -----------------------------------------------------------------------------------------------------*/
function altaUsuario(e) {
    e.preventDefault();

    const nuevo = {
        nombre: document.getElementById("alta-usr-name").value.trim(),
        email: document.getElementById("alta-usr-email").value.trim(),
        contraseña: document.getElementById("alta-usr-pswrd").value.trim()
    };

    if (!nuevo.nombre || !nuevo.email || !nuevo.contraseña) {
        alert("completa todos los campos");
        return;
    }

    const lista = almacenaje.obtenerUsuarios();
    lista.push(nuevo);
    almacenaje.guardarUsuarios(lista);

    mostrarUsuarios();
    e.target.reset();
}

/* FORMULARIO -------------------------------------------------------------------------------------------------------*/
export function formConnect() {
    const form = document.querySelector("#usuarios form");
    if (form) form.addEventListener("submit", altaUsuario);
}
