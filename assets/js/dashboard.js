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

/* GESTIÓN TARJETAS VOLUNTARIADOS --------------------------------------------------------------------*/
export async function actualizarDashboard() { /* Actualizar las tarjetas con los voluntariados ---------*/
  const container = document.querySelector('#dashboard .row.justify-content-center');
  container.innerHTML = '';
  const lista = await almacenaje.obtenerVoluntariados();

  lista.forEach(voluntariado => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'col-md-3 mb-4';
    tarjeta.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${voluntariado.titulo}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">${voluntariado.fecha}</h6>
          <p class="card-text">${voluntariado.descripcion}</p>
          <p class="card-text text-muted">Creado por: ${voluntariado.usuario}</p>
          <small class="text-primary">${voluntariado.tipo}</small>
        </div>
      </div>
    `;
    container.appendChild(tarjeta);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
    mostrarUsuarioActivo();
    await actualizarDashboard();
});