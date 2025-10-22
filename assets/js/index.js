// assets/js/index.js (CORREGIDO - Solo el núcleo de la carga y renderizado)

// Importaciones necesarias para Dashboard
import { anuncios as initialAnuncios } from './datos.js' // Usado solo para inicializar IndexedDB
import { obtenerUsuarioActivo, cerrarSesion, openDB, obtenerVoluntariadosDB } from './almacenaje.js'

const container = document.getElementById('cards-container')
const template = document.getElementById('card-template')
// ... (otras variables) ...

let voluntariados = [] // Variable para almacenar los datos de IndexedDB

// Función que ahora es asíncrona para obtener datos de IndexedDB
async function cargarYRenderizarVoluntariados() {
    try {
        // Asegura que la DB se abra y se carguen los datos iniciales de datos.js si es la primera vez
        await openDB(initialAnuncios);
        // OBTENEMOS los datos persistentes de IndexedDB
        voluntariados = await obtenerVoluntariadosDB(); 
        
        // Ahora renderCards usa la variable 'voluntariados' poblada desde IndexedDB
        renderCards(voluntariados);
    } catch (error) {
        console.error("Error al cargar voluntariados desde IndexedDB:", error);
        container.innerHTML = '<p class="text-danger">Error al cargar los datos del Dashboard.</p>';
    }
}

// Función de renderizado modificada para aceptar los datos
function renderCards(data) {
    container.innerHTML = '';
    // Iteramos sobre los datos cargados desde IndexedDB
	data.forEach(item => { 
		const clone = template.content.cloneNode(true)
		const titleEl = clone.querySelector('.vol-card__title')
		const dateEl = clone.querySelector('.vol-card__date')
		const descEl = clone.querySelector('.vol-card__desc')
		const authorEl = clone.querySelector('.vol-card__author-name')
		const article = clone.querySelector('.vol-card')

		titleEl.textContent = item.title
        // Nota: Si usas la versión D&D que te di, aquí deberías usar 'item.title', 'item.autor', etc.
		dateEl.textContent = item.date
		descEl.textContent = item.description
		authorEl.textContent = item.autor
        // El campo se llama volunType en datos.js y en tu DB
		article.classList.remove('vol-card--blue', 'vol-card--green')
		if (item.volunType === 'Oferta') {
			article.classList.add('vol-card--blue')
		} else {
			article.classList.add('vol-card--green')
		}

		container.appendChild(clone)
	})
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', () => {
    updateLoginStatus()
    setYear()
    // Llamamos a la nueva función asíncrona
    cargarYRenderizarVoluntariados();
})
// ... (updateLoginStatus y setYear se mantienen)