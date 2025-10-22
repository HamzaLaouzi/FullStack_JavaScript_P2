// Importaciones
// Importamos los datos iniciales y las funciones CRUD de IndexedDB
import { anuncios as initialAnuncios } from './datos.js'; 
import { obtenerUsuarioActivo, cerrarSesion, 
         openDB, obtenerVoluntariadosDB, guardarVoluntariadoDB, eliminarVoluntariadoDB 
} from './almacenaje.js';


/* GESTIÓN DE VOLUNTARIADOS --------------------------------------------------------------------------*/

// Función asíncrona para obtener y mostrar datos
async function mostrarVoluntariados() { 
  const container = document.getElementById('lista-voluntariados');
  if (!container) {
    console.error('No se encontró el contenedor lista-voluntariados');
    return;
  }
  container.innerHTML = '<tr><td colspan="6" class="text-center p-4">Cargando voluntariados...</td></tr>';

  try {
    // 1. Obtener los voluntariados de IndexedDB
    const voluntariados = await obtenerVoluntariadosDB(); 
    container.innerHTML = ''; 

    if (!voluntariados || voluntariados.length === 0) {
      container.innerHTML = '<tr><td colspan="6" class="text-center p-4">No hay voluntariados disponibles.</td></tr>';
      return;
    }

    const currentUser = obtenerUsuarioActivo();

    // 2. Renderizar la lista
    voluntariados.forEach((anuncio) => {
      const fila = document.createElement('tr');
      fila.className = 'align-middle';
      
      // El botón de eliminar ahora usa el ID único de IndexedDB (anuncio.id)
      const esAutor = currentUser && anuncio.autor === currentUser.email;
      const botonEliminar = esAutor ? `
        <button class="btn btn-sm btn-danger" onclick="eliminarVoluntariado(${anuncio.id})" title="Eliminar voluntariado">
          <i class="bi bi-trash"></i>
        </button>` : '';

      fila.innerHTML = `
        <td class="align-middle">${anuncio.title}</td>
        <td class="align-middle">${anuncio.autor}</td>
        <td class="align-middle">${anuncio.date}</td>
        <td class="align-middle">${anuncio.description}</td>
        <td class="align-middle text-center">
          <span class="badge ${anuncio.volunType === 'Oferta' ? 'bg-success' : 'bg-primary'} px-3 py-2">
            ${anuncio.volunType}
          </span>
        </td>
        <td class="text-center align-middle">
          ${botonEliminar}
        </td>
      `;
      container.appendChild(fila);
    });

  } catch (error) {
    console.error('Error al mostrar voluntariados:', error);
    container.innerHTML = '<tr><td colspan="6" class="text-center p-4 text-danger">Error al cargar los datos.</td></tr>';
  }
}

// Función asíncrona para eliminar por ID
window.eliminarVoluntariado = async function(voluntariadoId) { 
  const currentUser = obtenerUsuarioActivo();
  if (!currentUser) {
    alert('Debes iniciar sesión para eliminar voluntariados');
    return;
  }
  
  if (!confirm(`¿Estás seguro de que quieres eliminar este voluntariado?`)) {
    return;
  }

  try {
    await eliminarVoluntariadoDB(voluntariadoId); 
    alert('Voluntariado eliminado correctamente.');
    await mostrarVoluntariados(); // Refrescar
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al eliminar el voluntariado.');
  }
}

/* EVENTOS -------------------------------------------------------------------------------------------*/
// El listener de Alta también es asíncrono
document.querySelector('#voluntariados form').addEventListener('submit', async (e) => { 
  e.preventDefault();
  
  const titulo = document.getElementById('alta-vol-titulo').value.trim();
  const fecha = document.getElementById('alta-vol-fecha').value;
  const descripcion = document.querySelector('#alta-vol-desc').value.trim();
  const tipo = document.getElementById('alta-vol-tipo').value === 'Petición' ? 'Petición' : 'Oferta';

  // Validaciones
  if (!titulo || !fecha || !descripcion) {
    alert('Todos los campos son obligatorios');
    return;
  }
  
  const currentUser = obtenerUsuarioActivo();
  if (!currentUser) {
    // Guardar los datos del formulario en sessionStorage
    sessionStorage.setItem('voluntariadoPendiente', JSON.stringify({ titulo, fecha, descripcion, tipo }));
    alert('Para publicar el voluntariado necesitas iniciar sesión primero');
    window.location.href = 'login.html';
    return;
  }

  const nuevoVoluntariado = {
    title: titulo,
    date: fecha,
    description: descripcion,
    autor: currentUser.email,
    volunType: tipo
  };

  try {
    // Guardamos en IndexedDB, que generará el ID automáticamente
    await guardarVoluntariadoDB(nuevoVoluntariado);
    await mostrarVoluntariados(); // Refrescamos
    e.target.reset();
    alert('Voluntariado creado correctamente');
  } catch (error) {
    console.error('Error al crear voluntariado:', error);
    alert('Error al guardar el voluntariado.');
  }
});

// Función para actualizar el estado de login en la interfaz (sin cambios)
function updateLoginStatus() {
    const currentUser = obtenerUsuarioActivo();
    const navUser = document.getElementById('nav-user');
    const loginLink = document.querySelector('a[href="login.html"]');
    const userInput = document.getElementById('alta-vol-usuario');
    
    if (currentUser) {
        if (navUser) navUser.textContent = currentUser.email;
        if (loginLink) {
            loginLink.textContent = 'Logout';
            loginLink.href = '#';
            loginLink.onclick = function(e) {
                e.preventDefault();
                cerrarSesion();
                window.location.reload();
            }
        }
        if (userInput) {
            userInput.value = currentUser.email;
            userInput.disabled = true;
        }
    } else {
        if (navUser) navUser.textContent = '-no login-';
        if (loginLink) {
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
            loginLink.onclick = null;
        }
        if (userInput) {
            userInput.value = '-no login-';
            userInput.disabled = true;
        }
    }
}


// Función asíncrona que maneja la inicialización de la página
async function initializeVoluntariados() {
    // 1. Abrir/Inicializar IndexedDB con datos iniciales
    try {
        // openDB cargará los datos de initialAnuncios solo si no existe la DB
        await openDB(initialAnuncios); 
    } catch (e) {
        console.error('Fallo al inicializar la base de datos:', e);
        alert('No se pudo inicializar la base de datos de voluntariados.');
        return;
    }

    // 2. Procesar voluntariado pendiente (si existe)
    const voluntariadoPendienteStr = sessionStorage.getItem('voluntariadoPendiente');
    const currentUser = obtenerUsuarioActivo();

    if (voluntariadoPendienteStr && currentUser) {
        const { titulo, fecha, descripcion, tipo } = JSON.parse(voluntariadoPendienteStr);
        
        const nuevoVoluntariado = {
            title: titulo,
            date: fecha,
            description: descripcion,
            autor: currentUser.email,
            volunType: tipo
        };

        try {
            await guardarVoluntariadoDB(nuevoVoluntariado); 
            sessionStorage.removeItem('voluntariadoPendiente'); 
            alert('Voluntariado publicado después de iniciar sesión.');
        } catch (error) {
            console.error('Error al publicar voluntariado pendiente:', error);
        }
    }

    // 3. Actualizar el estado de login y mostrar la lista de voluntariados
    updateLoginStatus();
    await mostrarVoluntariados(); 
}

// Inicialización
document.addEventListener('DOMContentLoaded', initializeVoluntariados);