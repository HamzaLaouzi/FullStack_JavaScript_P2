// Importaciones
// Importamos los datos iniciales y las funciones CRUD de localStorage
import { usuarios as initialUsers } from './datos.js'; 
import { obtenerUsuarioActivo, cerrarSesion, 
         inicializarUsuarios, obtenerUsuarios, 
         guardarUsuario, eliminarUsuario as eliminarUsuarioStorage 
} from './almacenaje.js'


/* GESTIÓN DE USUARIOS --------------------------------------------------------------------------------*/

// Función para actualizar el estado de login en la interfaz (Sin cambios)
function updateLoginStatus() {
    // ... (Código para actualizar la barra de navegación)
    const currentUser = obtenerUsuarioActivo();
    const navUser = document.getElementById('nav-user');
    const loginLink = document.querySelector('a[href="login.html"]');
    
    if (currentUser) {
        if (navUser) {
            navUser.textContent = currentUser.email;
        }
        if (loginLink) {
            loginLink.textContent = 'Logout';
            loginLink.href = '#';
            loginLink.onclick = function(e) {
                e.preventDefault();
                cerrarSesion();
                window.location.href = 'login.html';
            }
        }
    } else {
        if (navUser) {
            navUser.textContent = '-no login-';
        }
        if (loginLink) {
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
            loginLink.onclick = null;
        }
    }
}

function mostrarUsuarios() { /* Mostrar los usuarios creados ----------------------------*/
    const container = document.getElementById('lista-usuarios');
    container.innerHTML = '';

    // [CÓDIGO CLAVE]: Leer siempre la lista actualizada de localStorage
    const usuarios = obtenerUsuarios(); 

    usuarios.forEach((usuario, index) => {
      const fila = document.createElement('tr');
      fila.className = 'align-middle';
      fila.innerHTML = `
        <td class="align-middle">${usuario.nombre}</td>
        <td class="align-middle">${usuario.email}</td>
        <td class="align-middle">${usuario.password}</td>
        <td class="text-center align-middle">
          <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${index})" title="Eliminar usuario">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      `;
      container.appendChild(fila);
    });
}

window.eliminarUsuario = function(indice) { /* Eliminar usuarios ---------------------------------*/
    const currentUser = obtenerUsuarioActivo();
    if (!currentUser) {
        alert('Debes iniciar sesión para eliminar usuarios');
        return;
    }
    
    try {
        eliminarUsuarioStorage(indice); 
        // [CÓDIGO CLAVE]: Volver a llamar para refrescar la tabla
        mostrarUsuarios(); 
    } catch (error) {
        alert(error.message);
    }
}

/* EVENTOS -------------------------------------------------------------------------------------------*/
document.querySelector('#usuarios form').addEventListener('submit', (e) => { /* Alta -----*/
  e.preventDefault();
  
  // ... (Obtención y validación de campos)

  const nombre = document.getElementById('alta-usr-name').value.trim();
  const email = document.getElementById('alta-usr-email').value.trim();
  const password = document.getElementById('alta-usr-pswrd').value;

  if (!nombre || !email || !password) {
    alert('Todos los campos son obligatorios');
    return;
  }

  // Verificar si el email ya existe en localStorage
  if (obtenerUsuarios().some(u => u.email === email)) {
    alert('Ya existe un usuario con ese email');
    return;
  }
  
  const nuevoUsuario = {
    nombre,
    email,
    password 
  };
  
  // Guardar el nuevo usuario en localStorage
  guardarUsuario(nuevoUsuario);

  // [CÓDIGO CLAVE]: Volver a llamar para refrescar la tabla
  mostrarUsuarios(); 
  e.target.reset();
  alert('Usuario creado correctamente.');
});

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar localStorage con los usuarios de datos.js si es la primera vez
    inicializarUsuarios(initialUsers);

    updateLoginStatus();
    // [CÓDIGO CLAVE]: La llamada inicial que carga los datos persistentes
    mostrarUsuarios(); 
});