/**
 * Lógica del fichero usuarios.html
 */

import { showActiveUser, loadUsersToStorage, addNewUser, showUsersTable } from "./almacenaje.js"

// Cargar usuarios al iniciar
loadUsersToStorage()

// Mostrar usuario activo
showActiveUser()

// Mostrar tabla de usuarios
showUsersTable()

// Manejar el formulario de alta de usuario
const formAltaUsuario = document.getElementById("formAltaUsuario")
if (formAltaUsuario) {
    formAltaUsuario.addEventListener("submit", addNewUser)
}
