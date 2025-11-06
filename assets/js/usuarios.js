import { usuarios } from "./datos.js";
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

/* GESTIÓN DE USUARIOS --------------------------------------------------------------------------------*/
function mostrarUsuarios() { /* Mostrar los usuarios creados ----------------------------*/
    const container = document.getElementById('lista-usuarios');
    container .innerHTML = '';

    usuarios.forEach((usuario, index) => {
      const fila = document.createElement('div');
      fila.className = 'row row-cols-4 border-bottom py-2';
      fila.innerHTML = `
        <div class="col">${usuario.nombre}</div>
        <div class="col">${usuario.email}</div>
        <div class="col">${usuario.contraseña}</div>
        <div class="col text-center">
          <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${index})">Borrar</button>
        </div>
      `;
      container .appendChild(fila);
    });
}
window.eliminarUsuario = function(indice) { /* Eliminar usuarios ---------------------------------*/
    usuarios.splice(indice, 1);
    mostrarUsuarios();
}

/* EVENTOS -------------------------------------------------------------------------------------------*/
document.querySelector('#usuarios form').addEventListener('submit', (e) => { /* Alta -----*/
  e.preventDefault();
  
  const nuevoUsuario = {
    nombre: document.getElementById('alta-usr-name').value,
    email: document.getElementById('alta-usr-email').value,
    contraseña: document.getElementById('alta-usr-pswrd').value
  };
  
  if (nuevoUsuario.nombre && nuevoUsuario.email && nuevoUsuario.contraseña) {
    usuarios.push(nuevoUsuario);
    mostrarUsuarios();
    e.target.reset();
  }
});

document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuarioActivo();
    mostrarUsuarios();
});