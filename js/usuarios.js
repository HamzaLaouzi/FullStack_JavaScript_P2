import { crearUsuario, obtenerUsuarios, borrarUsuario, obtenerUsuarioActivo } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formAltaUsuario");
  const tablaBody = document.getElementById("tablaUsuarios");
  const usuarioActivoSpan = document.getElementById("usuarioActivo");

  function mostrarUsuarioActivo() {
    const user = obtenerUsuarioActivo();
    usuarioActivoSpan.textContent = user ? user.email : "- no login -";
  }

  function pintarUsuarios() {
    const lista = obtenerUsuarios();
    tablaBody.innerHTML = "";

    lista.forEach((u) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td>••••••</td>
        <td>
          <button class="btn btn-danger btn-sm borrar" data-email="${u.email}">Borrar</button>
        </td>
      `;
      tablaBody.appendChild(tr);
    });

    document.querySelectorAll(".borrar").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("¿Seguro que quieres borrar este usuario?")) {
          borrarUsuario(btn.dataset.email);
          pintarUsuarios();
        }
      });
    });
  }

  mostrarUsuarioActivo();
  pintarUsuarios();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!nombre || !email || !password) {
      alert("Completa todos los campos");
      return;
    }

    const ok = crearUsuario({ nombre, email, password });
    if (!ok) {
      alert("El email ya existe ❌");
      return;
    }

    form.reset();
    pintarUsuarios();
  });
});
