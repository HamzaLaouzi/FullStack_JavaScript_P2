import { guardarVoluntariado, obtenerVoluntariados, borrarVoluntariado, obtenerUsuarioActivo, guardarUsuarioActivo } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAltaVoluntariado");
  const tablaBody = document.getElementById("tablaVoluntariados");
  const usuarioActivoSpan = document.getElementById("usuarioActivo");
  const canvas = document.getElementById("grafico");
  const ctx = canvas.getContext("2d");
  const cardsContainer = document.getElementById("cards");
  const seleccionContainer = document.getElementById("seleccion");
  const filtroPeticiones = document.getElementById("filtroPeticiones");
  const filtroOfertas = document.getElementById("filtroOfertas");
  const filtroTodos = document.getElementById("filtroTodos");

  let userActivo = obtenerUsuarioActivo();
  if (userActivo && !userActivo.seleccion) {
    userActivo.seleccion = [];
    guardarUsuarioActivo(userActivo);
  }

  mostrarUsuarioActivo();
  pintarVoluntariadosTabla();
  dibujarGrafico();
  cargarVoluntariados("Todos");
  cargarSeleccion();

  // --- Funciones ---
  function mostrarUsuarioActivo() {
    const usuario = obtenerUsuarioActivo();
    usuarioActivoSpan.textContent = usuario ? usuario.email : "- no login -";
  }

  // --- ALTA DE VOLUNTARIADO ---
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const email = document.getElementById("email").value.trim();
    const fecha = document.getElementById("fecha").value;
    const descripcion = document.getElementById("descripcion").value.trim();
    const tipo = document.getElementById("tipo").value;

    if (!titulo || !email || !fecha || !descripcion || !tipo) {
      alert("Completa todos los campos");
      return;
    }

    const vol = { id: Date.now(), titulo, email, fecha, descripcion, tipo };

    guardarVoluntariado(vol);
    alert("Voluntariado creado ✔");
    form.reset();
    pintarVoluntariadosTabla();
    dibujarGrafico();
    cargarVoluntariados();
  });

  // --- PINTAR TABLA ---
  function pintarVoluntariadosTabla() {
    const lista = obtenerVoluntariados();
    tablaBody.innerHTML = "";

    lista.forEach((v) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.titulo}</td>
        <td>${v.email}</td>
        <td>${v.fecha}</td>
        <td>${v.descripcion}</td>
        <td>${v.tipo}</td>
        <td>
          <button class="btn btn-danger btn-sm borrar" data-id="${v.id}">Borrar</button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });

    document.querySelectorAll(".borrar").forEach(btn => {
      btn.addEventListener("click", () => {
        if (confirm("¿Seguro que quieres borrar este voluntariado?")) {
          borrarVoluntariado(Number(btn.dataset.id));
          pintarVoluntariadosTabla();
          dibujarGrafico();
          cargarVoluntariados();
          cargarSeleccion();
        }
      });
    });
  }

  // --- GRAFICO ---
  function dibujarGrafico() {
    const lista = obtenerVoluntariados();
    const tipos = { Petición: 0, Oferta: 0 };
    lista.forEach(v => { tipos[v.tipo]++; });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const total = tipos.Petición + tipos.Oferta;
    if (total === 0) return;

    const width = canvas.width / total;
    let x = 0;

    ctx.fillStyle = "#ff6384";
    ctx.fillRect(x, canvas.height - (tipos.Petición * 20), width, tipos.Petición * 20);
    ctx.fillStyle = "#000";
    ctx.fillText(`Peticiones: ${tipos.Petición}`, x + 5, canvas.height - (tipos.Petición * 20) - 5);
    x += width;

    ctx.fillStyle = "#36a2eb";
    ctx.fillRect(x, canvas.height - (tipos.Oferta * 20), width, tipos.Oferta * 20);
    ctx.fillStyle = "#000";
    ctx.fillText(`Ofertas: ${tipos.Oferta}`, x + 5, canvas.height - (tipos.Oferta * 20) - 5);
  }

  // --- VOLUNTARIADOS DISPONIBLES (TARJETAS) ---
  function cargarVoluntariados(tipo = null) {
    const lista = obtenerVoluntariados();
    cardsContainer.innerHTML = "";

    const filtrada = tipo && tipo !== "Todos" ? lista.filter(v => v.tipo === tipo) : lista;

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

      card.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", vol.id);
      });

      cardsContainer.appendChild(card);
    });
  }

  // --- FILTROS ---
  filtroPeticiones.addEventListener("click", () => cargarVoluntariados("Petición"));
  filtroOfertas.addEventListener("click", () => cargarVoluntariados("Oferta"));
  filtroTodos.addEventListener("click", () => cargarVoluntariados("Todos"));

  // --- MIS VOLUNTARIADOS (SELECCION) ---
  seleccionContainer.addEventListener("dragover", (e) => e.preventDefault());

  seleccionContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const lista = obtenerVoluntariados();
    const vol = lista.find(v => v.id === Number(id));
    if (!vol) return;

    userActivo = obtenerUsuarioActivo();
    if (!userActivo.seleccion.some(v => v.id === vol.id)) {
      userActivo.seleccion.push(vol);
      guardarUsuarioActivo(userActivo);
      pintarSeleccion(vol);
    }
  });

  function cargarSeleccion() {
    seleccionContainer.innerHTML = "";
    userActivo = obtenerUsuarioActivo();
    if (!userActivo || !userActivo.seleccion) return;
    userActivo.seleccion.forEach(vol => pintarSeleccion(vol));
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

    card.querySelector("button").addEventListener("click", () => {
      userActivo = obtenerUsuarioActivo();
      userActivo.seleccion = userActivo.seleccion.filter(v => v.id !== vol.id);
      guardarUsuarioActivo(userActivo);
      card.remove();
    });

    seleccionContainer.appendChild(card);
  }
});
