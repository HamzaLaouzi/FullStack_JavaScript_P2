import { obtenerUsuarioActivo, cerrarSesion } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivoSpan = document.getElementById("usuarioActivo");
  const loginLink = document.getElementById("loginLink");
  const logoutLink = document.getElementById("logoutLink");
  const navVoluntarios = document.getElementById("navVoluntarios");
  const navUsuarios = document.getElementById("navUsuarios");

  const userActivo = obtenerUsuarioActivo();

  usuarioActivoSpan.textContent = userActivo ? userActivo.email : "- no login -";
  if (loginLink) loginLink.style.display = userActivo ? "none" : "inline";
  if (logoutLink) logoutLink.style.display = userActivo ? "inline" : "none";
  if (navVoluntarios) navVoluntarios.style.display = userActivo ? "inline" : "none";
  if (navUsuarios) navUsuarios.style.display = userActivo ? "inline" : "none";

  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      cerrarSesion();
      window.location.href = "login.html";
    });
  }
});
