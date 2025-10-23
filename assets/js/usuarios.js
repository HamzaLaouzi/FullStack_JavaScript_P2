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
    formAltaUsuario.addEventListener("submit", (e) => {
        e.preventDefault()
        
        const nombre = document.getElementById("nombre").value.trim()
        const email = document.getElementById("email").value.trim()
        const password = document.getElementById("password").value.trim()
        
        if (!nombre || !email || !password) {
            alert("Todos los campos son obligatorios")
            return
        }
        
        // Verificar si el usuario ya existe
        const usuarios = JSON.parse(localStorage.getItem("storageUsers")) || []
        if (usuarios.some(u => u.email === email)) {
            alert("Ya existe un usuario con ese email")
            return
        }
        
        // Añadir el nuevo usuario
        usuarios.push({ name: nombre, email, password })
        localStorage.setItem("storageUsers", JSON.stringify(usuarios))
        
        alert("Usuario creado correctamente")
        formAltaUsuario.reset()
        showUsersTable()
    })
}
