/**
* lógica del fichero login.html
*/

// Importamos las funciones necesarias de almacenaje.js
import { loginUser, showActiveUser, loadUsersToStorage } from "./almacenaje.js";

// Cargar usuarios en el almacenamiento local al iniciar
loadUsersToStorage();

// Mostrar usuario activo si existe
showActiveUser();

// Elementos del DOM
const domSubmitButton = document.getElementById('submitValues');
const domLoginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('loginInputEmail');
const passwordInput = document.getElementById('loginInputPassword');

// Manejador del evento de envío del formulario
if (domSubmitButton) {
    domSubmitButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Validar formulario
        if (!domLoginForm.checkValidity()) {
            e.stopPropagation();
            domLoginForm.classList.add('was-validated');
            return;
        }
        
        // Llamar a la función de login y redirigir si es exitoso
        if (loginUser()) {
            window.location.href = 'index.html';
        }
    });
}

// Función para manejar el cierre de sesión
function handleLogout() {
    localStorage.removeItem('activeUser');
    window.location.href = 'login.html';
}

// Verificar si hay un usuario logueado al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const activeUser = localStorage.getItem('activeUser');
    const navUser = document.getElementById('nav-user');
    
    if (activeUser && navUser) {
        navUser.textContent = activeUser;
        
        // Añadir botón de cerrar sesión
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Cerrar sesión';
        logoutButton.className = 'btn btn-link p-0 ms-2';
        logoutButton.onclick = handleLogout;
        
        navUser.appendChild(document.createElement('br'));
        navUser.appendChild(logoutButton);
    }
});