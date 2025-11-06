import { voluntariados } from "./datos.js";
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

/* GESTIÓN DE VOLUNTARIADOS --------------------------------------------------------------------------*/
function mostrarVoluntariados() { /* Mostrar los voluntariados creados --------------------*/
  const container = document.getElementById('lista-voluntariados');
  container.innerHTML = '';

  voluntariados.forEach((voluntariado, index) => {
    const fila = document.createElement('div');
    fila.className = 'row row-cols-6 border-bottom py-2';
    fila.innerHTML = `
      <div class="col">${voluntariado.titulo}</div>
      <div class="col">${voluntariado.usuario}</div>
      <div class="col">${voluntariado.fecha}</div>
      <div class="col">${voluntariado.descripcion}</div>
      <div class="col">${voluntariado.tipo}</div>
      <div class="col text-center">
        <button class="btn btn-sm btn-danger" onclick="eliminarVoluntariado(${index})">Borrar</button>
      </div>
    `;
    container.appendChild(fila);
  });
}
window.eliminarVoluntariado = function(indice) { /* Eliminar voluntariado --------------------------*/
  voluntariados.splice(indice, 1);
  mostrarVoluntariados();
  actualizarDashboard();s /* Actualizar en el inicio */
}

/* EVENTOS -------------------------------------------------------------------------------------------*/
document.querySelector('#voluntariados form').addEventListener('submit', (e) => { /* Alta -*/
  e.preventDefault();
  
  const nuevoVoluntariado = {
    titulo: document.getElementById('alta-vol-titulo').value,
    usuario: document.getElementById('alta-vol-usuario').value,
    fecha: document.getElementById('alta-vol-fecha').value,
    descripcion: document.querySelector('#alta-vol-desc').value,
    tipo: document.getElementById('alta-vol-tipo').value
  };

  if (nuevoVoluntariado.titulo && nuevoVoluntariado.usuario && nuevoVoluntariado.fecha) {
    voluntariados.push(nuevoVoluntariado);
    mostrarVoluntariados();
    actualizarDashboard(); /* Actualizar inicio */
    e.target.reset();
  }
});

document.addEventListener("DOMContentLoaded", () => {
    mostrarUsuarioActivo();
    mostrarVoluntariados();
});