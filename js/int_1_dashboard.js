import { getAllVols, getSeleccion, addSeleccion, removeSeleccion, obtenerUsuarioActivo } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("cards");
  const seleccionContainer = document.getElementById("seleccion");
  const filtroTodos = document.getElementById("filtroTodos");
  const filtroPeticiones = document.getElementById("filtroPeticiones");
  const filtroOfertas = document.getElementById("filtroOfertas");

  const user = obtenerUsuarioActivo();
  const email = user ? user.email : null;

  cargarVoluntariados("Todos");
  cargarSeleccion();

  async function cargarVoluntariados(tipo = "Todos") {
    const lista = await getAllVols();
    cardsContainer.innerHTML = "";
    const filtrada = tipo === "Todos" ? lista : lista.filter(v => v.tipo === tipo);

    filtrada.forEach(vol => {
      const card = document.createElement("div");
      card.className = "card mb-3 p-2 shadow draggable";
      card.setAttribute("draggable", true);
      card.dataset.id = vol.id;
      card.innerHTML = `
        <h5>${vol.titulo}</h5>
        <p>Email: ${vol.email}</p>
        <p>Fecha: ${vol.fecha}</p>
        <p>${vol.descripcion}</p>
        <span class="badge bg-info">${vol.tipo}</span>
      `;
      card.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", vol.id));
      cardsContainer.appendChild(card);
    });
  }

  filtroTodos.addEventListener("click", () => cargarVoluntariados("Todos"));
  filtroPeticiones.addEventListener("click", () => cargarVoluntariados("Petición"));
  filtroOfertas.addEventListener("click", () => cargarVoluntariados("Oferta"));

  seleccionContainer.addEventListener("dragover", (e) => e.preventDefault());
  seleccionContainer.addEventListener("drop", async (e) => {
    e.preventDefault();
    if (!email) return;
    const volId = Number(e.dataTransfer.getData("text/plain"));
    await addSeleccion(email, volId);
    await cargarSeleccion();
  });

  async function cargarSeleccion() {
    seleccionContainer.innerHTML = "";
    if (!email) return;
    const [lista, ids] = await Promise.all([getAllVols(), getSeleccion(email)]);
    const seleccionados = lista.filter(v => ids.includes(v.id));
    seleccionados.forEach(pintarSeleccion);
  }

  function pintarSeleccion(vol) {
    const card = document.createElement("div");
    card.className = "card mb-2 p-2 shadow d-flex justify-content-between align-items-center";
    card.dataset.id = vol.id;
    card.innerHTML = `
      <div>
        <h6>${vol.titulo}</h6>
        <p>${vol.fecha}</p>
      </div>
      <button class="btn btn-sm btn-danger">✖</button>
    `;
    card.querySelector("button").addEventListener("click", async () => {
      await removeSeleccion(email, vol.id);
      card.remove();
    });
    seleccionContainer.appendChild(card);
  }
});
