import { obtenerUsuarios, guardarUsuarioActivo, obtenerUsuarioActivo } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const usuarioActivoSpan = document.getElementById("usuarioActivo");
  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");

  function actualizarNavbar() {
    const userActivo = obtenerUsuarioActivo();
    usuarioActivoSpan.textContent = userActivo ? userActivo.email : "- no login -";
    loginLink.style.display = userActivo ? "none" : "inline";
    logoutLink.style.display = userActivo ? "inline" : "none";
  }

  actualizarNavbar();

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const usuarios = obtenerUsuarios();
      const user = usuarios.find(u => u.email === email && u.password === password);

      if (!user) {
        document.getElementById("mensajeError").classList.remove("d-none");
        return;
      }

      guardarUsuarioActivo(user);
      actualizarNavbar();
      window.location.href = "index.html";
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("usuarioActivo");
      actualizarNavbar();
      window.location.href = "login.html";
    });
  }
});
