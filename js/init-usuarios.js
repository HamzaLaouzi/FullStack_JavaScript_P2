// init-usuarios.js
import { crearUsuario, obtenerUsuarios } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", () => {
  const usuarios = obtenerUsuarios();

  // Solo inicializa si no hay usuarios
  if (usuarios.length === 0) {
    const ejemplos = [
      { nombre: "Admin", email: "admin@example.com", password: "admin123" },
      { nombre: "Voluntario", email: "voluntario@example.com", password: "vol123" },
      { nombre: "Usuario", email: "usuario@example.com", password: "user123" }
    ];

    ejemplos.forEach(u => crearUsuario(u));

    console.log("✅ Usuarios de ejemplo cargados en localStorage");
  }
});
