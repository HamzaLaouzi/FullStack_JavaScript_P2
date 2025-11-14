import { addVol, getAllVols, deleteVol, obtenerUsuarioActivo } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAltaVoluntariado");
  const tablaBody = document.getElementById("tablaVoluntariados");
  const usuarioActivoSpan = document.getElementById("usuarioActivo");
  const canvas = document.getElementById("grafico");
  const ctx = canvas.getContext("2d");

  function mostrarUsuarioActivo() {
    const usuario = obtenerUsuarioActivo();
    usuarioActivoSpan.textContent = usuario ? usuario.email : "- no login -";
    const emailInput = document.getElementById("email");
    if (usuario && emailInput) emailInput.value = usuario.email;
  }

  async function pintarVoluntariados() {
    const lista = await getAllVols();
    tablaBody.innerHTML = "";
    lista.forEach((v) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${v.titulo}</td>
        <td>${v.email}</td>
        <td>${v.fecha}</td>
        <td>${v.descripcion}</td>
        <td>${v.tipo}</td>
        <td><button class="btn btn-danger btn-sm borrar" data-id="${v.id}">Borrar</button></td>
      `;
      tablaBody.appendChild(tr);
    });

    document.querySelectorAll(".borrar").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("¿Seguro que quieres borrar este voluntariado?")) {
          await deleteVol(Number(btn.dataset.id));
          await pintarVoluntariados();
          await dibujarGrafico();
        }
      });
    });
  }

  async function dibujarGrafico() {
    const lista = await getAllVols();
    const tipos = { Petición: 0, Oferta: 0 };
    lista.forEach(v => { tipos[v.tipo] = (tipos[v.tipo] ?? 0) + 1; });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const max = Math.max(tipos.Petición, tipos.Oferta);
    if (max === 0) return;

    const barWidth = (canvas.width - 40) / 2;
    const scale = (canvas.height - 40) / max;

    ctx.fillStyle = "#ff6384";
    const petHeight = tipos.Petición * scale;
    ctx.fillRect(20, canvas.height - petHeight - 20, barWidth, petHeight);
    ctx.fillStyle = "#000";
    ctx.fillText(`Peticiones: ${tipos.Petición}`, 25, canvas.height - petHeight - 25);

    ctx.fillStyle = "#36a2eb";
    const ofHeight = tipos.Oferta * scale;
    ctx.fillRect(barWidth + 40, canvas.height - ofHeight - 20, barWidth, ofHeight);
    ctx.fillStyle = "#000";
    ctx.fillText(`Ofertas: ${tipos.Oferta}`, barWidth + 45, canvas.height - ofHeight - 25);
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
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
      await addVol(vol);
      form.reset();
      const usuario = obtenerUsuarioActivo();
      if (usuario) document.getElementById("email").value = usuario.email;

      await pintarVoluntariados();
      await dibujarGrafico();
    });
  }

  mostrarUsuarioActivo();
  pintarVoluntariados();
  dibujarGrafico();
});
