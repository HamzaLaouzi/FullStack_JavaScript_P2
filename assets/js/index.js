// Lógica completa del Dashboard: Carga de datos de IndexedDB, Drag and Drop, y persistencia de selección.

import { anuncios as initialAnuncios } from './datos.js'; // Solo para inicializar IndexedDB si es necesario
import { obtenerUsuarioActivo, cerrarSesion, openDB, obtenerVoluntariadosDB } from './almacenaje.js';

// Elementos del DOM
const cardsContainer = document.getElementById('cards-container');
const template = document.getElementById('card-template');
// Contenedor de selección (debe estar en index.html)
const seleccionContainer = document.getElementById('seleccion-container'); 
const filterButtons = document.querySelectorAll('[data-filter]');

// Estado global de la aplicación
let voluntariados = [];
// Usamos localStorage para persistir la selección (Requisito de D&D)
// Inicializamos el Set con los IDs previamente seleccionados (si existen)
let seleccionados = new Set(JSON.parse(localStorage.getItem('seleccionados')) || []); 
let filtroActual = 'todos';

// --- Funciones de Persistencia (localStorage) ---
function guardarSeleccion() {
    localStorage.setItem('seleccionados', JSON.stringify(Array.from(seleccionados)));
}

// --- Funciones de Renderizado ---
function renderCards() {
    cardsContainer.innerHTML = '';
    // Filtra por tipo y excluye los que ya están en la selección
    const filteredVoluntariados = voluntariados.filter(v => 
        (filtroActual === 'todos' || v.volunType === filtroActual) && 
        !seleccionados.has(String(v.id))
    );
    
    if (filteredVoluntariados.length === 0) {
        cardsContainer.innerHTML = '<p class="text-muted text-center col-12 my-5">No hay voluntariados disponibles.</p>';
        return;
    }

    filteredVoluntariados.forEach(item => {
        const clone = template.content.cloneNode(true);
        const article = clone.querySelector('article');

        // Configuración para Drag and Drop
        article.dataset.id = item.id; // CLAVE: ID para D&D
        article.draggable = true;
        
        // Asignación de datos
        clone.querySelector('.vol-card__title').textContent = item.title;
        clone.querySelector('.vol-card__date').textContent = item.date;
        clone.querySelector('.vol-card__desc').textContent = item.description;
        clone.querySelector('.vol-card__author-name').textContent = item.autor;

        // Estilos
        article.classList.remove('vol-card--blue', 'vol-card--green');
        article.classList.add(item.volunType === 'Oferta' ? 'vol-card--blue' : 'vol-card--green');
        
        // Evento D&D
        article.addEventListener('dragstart', handleDragStart);

        cardsContainer.appendChild(clone);
    });
}

function renderSeleccion() {
    seleccionContainer.innerHTML = '';
    
    if (seleccionados.size === 0) {
        seleccionContainer.innerHTML = '<p class="text-muted text-center my-5">Arrastra aquí los voluntariados que te interesen.</p>';
        return;
    }

    seleccionados.forEach(id => {
        // Busca el voluntariado por ID en la lista completa
        const item = voluntariados.find(v => String(v.id) === id);
        if (item) {
            const element = document.createElement('div');
            element.className = 'card vol-card h-100 shadow mb-2';
            element.dataset.id = item.id;
            
            // Estilos
            element.classList.add(item.volunType === 'Oferta' ? 'vol-card--blue' : 'vol-card--green');

            // Contenido de la tarjeta de selección
            element.innerHTML = `
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0 vol-card__title">${item.title}</h6>
                            <small class="vol-card__date">${item.date}</small>
                        </div>
                        <button class="btn btn-sm btn-light btn-remove-selection" data-id="${item.id}">
                            &times;
                        </button>
                    </div>
                </div>
            `;
            
            // Evento para quitar con botón
            element.querySelector('.btn-remove-selection').addEventListener('click', () => quitarDeSeleccion(item.id));

            seleccionContainer.appendChild(element);
        }
    });
}

function actualizarVistas() {
    renderCards();
    renderSeleccion();
}

// --- Lógica de Drag and Drop (D&D API) ---

function handleDragStart(e) {
    // Guarda el ID del voluntariado que se está arrastrando
    e.dataTransfer.setData('text/plain', e.target.closest('article, .card').dataset.id); 
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault(); // CLAVE: Permite que el drop (soltar) ocurra
    e.currentTarget.classList.add('drag-over');
    e.dataTransfer.dropEffect = 'move';
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    const id = e.dataTransfer.getData('text/plain');
    
    if (!id) return;

    // Si se suelta en el contenedor de selección
    if (e.currentTarget.id === 'seleccion-container') {
        if (!seleccionados.has(id)) {
            agregarASeleccion(id);
        }
    } 
    // Si se suelta en el contenedor de tarjetas principal (para deseleccionar)
    else if (e.currentTarget.id === 'cards-container') {
        if (seleccionados.has(id)) {
            quitarDeSeleccion(id);
        }
    }
}

function agregarASeleccion(id) {
    seleccionados.add(String(id));
    guardarSeleccion();
    actualizarVistas(); 
}

function quitarDeSeleccion(id) {
    seleccionados.delete(String(id));
    guardarSeleccion();
    actualizarVistas(); 
}

// --- Carga de Datos y Inicialización ---
async function cargarVoluntariados() {
    try {
        // 1. Inicializa IndexedDB si es la primera vez (usando datos.js)
        await openDB(initialAnuncios); 
        // 2. Carga los datos persistentes
        voluntariados = await obtenerVoluntariadosDB();
        // 3. Asegura que los IDs sean strings para la comparación con el Set de selección
        voluntariados = voluntariados.map(v => ({ ...v, id: String(v.id) }));
        
        // Renderiza ambas secciones
        actualizarVistas();
    } catch (error) {
        console.error('Error al cargar voluntariados:', error);
        cardsContainer.innerHTML = '<p class="text-danger col-12 my-5">Error al cargar los datos del Dashboard.</p>';
    }
}

function initDashboard() {
    updateLoginStatus();
    // Es posible que necesites la función setYear si la tienes en otro script
    // setYear(); 
    cargarVoluntariados();
    
    // Inicialización de Drop Zones y Listeners D&D
    seleccionContainer.addEventListener('dragover', handleDragOver);
    seleccionContainer.addEventListener('dragleave', handleDragLeave);
    seleccionContainer.addEventListener('drop', handleDrop);
    
    cardsContainer.addEventListener('dragover', handleDragOver);
    cardsContainer.addEventListener('dragleave', handleDragLeave);
    cardsContainer.addEventListener('drop', handleDrop); // Permite soltar aquí para deseleccionar
    
    // Listeners de filtro
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filtroActual = e.target.dataset.filter;
            // Manejo de clases para el filtro visual
            filterButtons.forEach(b => {
                const isActive = b.dataset.filter === filtroActual;
                b.classList.toggle('btn-primary', isActive);
                b.classList.toggle('btn-outline-primary', !isActive);
            });
            actualizarVistas();
        });
    });
}

// Funciones Auxiliares (Asegúrate de que 'setYear' esté definida o elimínala si no se usa)
function updateLoginStatus() {
    const currentUser = obtenerUsuarioActivo();
    const navUser = document.getElementById('nav-user');
    const loginLink = document.querySelector('a[href="login.html"]');
    
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
    } else {
        if (navUser) navUser.textContent = '-no login-';
        if (loginLink) {
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
            loginLink.onclick = null;
        }
    }
}

function setYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}


document.addEventListener('DOMContentLoaded', initDashboard);