// int_1_dashboard.js
import * as almacenaje from "./almacenaje.js";

/* USUARIO ACTIVO --------------------------------------------------------------------------------------------------*/
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

/* CREAR TARJETAS -------------------------------------------------------------------------------------------------*/
async function crearTarjetas() {
  const lista = await almacenaje.obtenerVoluntariados();
  const contenedor = document.getElementById("tarjetasVoluntariados");

  contenedor.innerHTML = "";

  lista.forEach(vol => {
    const card = document.createElement("div");
    card.className = "card mb-3 p-2";
    card.draggable = true;
    card.dataset.id = vol.id;

    card.innerHTML = `
      <h5>${vol.titulo}</h5>
      <small>${vol.fecha}</small>
      <p>${vol.descripcion}</p>
      <p class="text-muted">Creado por: ${vol.usuario}</p>
      <span class="badge bg-primary">${vol.tipo}</span>
    `;

    dragDrop(card);
    contenedor.appendChild(card);
  });
}

/* DRAG & DROP ---------------------------------------------------------------------------------------------------*/
function dragDrop(el) {
  el.addEventListener("dragstart", e => {
    e.target.classList.add("dragging");
    e.dataTransfer.setData("text/plain", e.target.dataset.id);
  });

  el.addEventListener("dragend", e => {
    e.target.classList.remove("dragging");
  });
}

function dragDropArea(area) {
  area.addEventListener("dragover", e => e.preventDefault());

  area.addEventListener("drop", e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");

    const tarjeta = document.querySelector(`[data-id="${id}"]`);
    if (tarjeta) area.appendChild(tarjeta);
  });
}

/* -------------------- INIT -------------------- */
document.addEventListener("DOMContentLoaded", async () => {
  mostrarUsuarioActivo();

  dragDropArea(document.getElementById("tarjetasVoluntariados"));
  dragDropArea(document.getElementById("seleccionVoluntariados"));

  await crearTarjetas();
});
