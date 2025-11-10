/**
 * Lógica del fichero usuarios.html
 */

import { showActiveUser, loadUsersToStorage, addNewUser, showUsersTable } from "./almacenaje.js"

// Función de inicialización que asegura el orden correcto de ejecución
function inicializarPaginaUsuarios() {
    console.log("=== usuarios.js inicializando ===")
    
    // 1. Cargar usuarios al localStorage si no existen
    loadUsersToStorage()
    
    // 2. Mostrar usuario activo
    showActiveUser()
    
    // 3. Mostrar tabla de usuarios (después de cargar)
    showUsersTable()
    
    // 4. Manejar el formulario de alta de usuario
    const formAltaUsuario = document.getElementById("formAltaUsuario")
    if (formAltaUsuario) {
        console.log("✅ Formulario encontrado, registrando listener")
        formAltaUsuario.addEventListener("submit", addNewUser)
    } else {
        console.error("❌ No se encontró el formulario formAltaUsuario")
    }
    
    console.log("=== usuarios.js inicialización completa ===")
}

// Ejecutar inicialización cuando el DOM esté listo
window.addEventListener("DOMContentLoaded", inicializarPaginaUsuarios)
