import { AlmacenajeVoluntariados, GestionUsuarioActivo } from './almacenaje.js';

class DashboardVoluntariados {
    constructor() {
        this.almacenaje = new AlmacenajeVoluntariados();
        this.voluntariados = [];
        this.filtroActual = 'todos';
        this.seleccionados = new Set();
        this.initEventListeners();
        this.cargarVoluntariados();
        this.mostrarUsuarioActivo();
    }

    async cargarVoluntariados() {
        try {
            this.voluntariados = await this.almacenaje.obtenerVoluntariados();
            this.mostrarVoluntariados();
        } catch (error) {
            console.error('Error al cargar voluntariados:', error);
        }
    }

    mostrarVoluntariados() {
        const container = document.getElementById('voluntariados-container');
        container.innerHTML = '';

        this.voluntariados
            .filter(v => this.filtroActual === 'todos' || v.tipo === this.filtroActual)
            .forEach(voluntariado => {
                const card = this.crearTarjetaVoluntariado(voluntariado);
                container.appendChild(card);
            });
    }

    crearTarjetaVoluntariado(voluntariado) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        const card = document.createElement('div');
        card.className = 'card h-100 voluntariado-card shadow-sm';
        card.draggable = true;
        card.dataset.id = voluntariado.id;

        const badgeClass = voluntariado.tipo === 'Oferta' ? 'bg-success' : 'bg-primary';
        
        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title">${voluntariado.titulo}</h5>
                    <span class="badge ${badgeClass}">${voluntariado.tipo}</span>
                </div>
                <p class="card-text">${voluntariado.descripcion}</p>
                <div class="mt-3 text-muted">
                    <small>
                        <i class="bi bi-calendar-event"></i> 
                        ${new Date(voluntariado.fecha).toLocaleDateString()}
                    </small>
                    <br>
                    <small>
                        <i class="bi bi-person"></i> 
                        ${voluntariado.email}
                    </small>
                </div>
            </div>
        `;

        // Eventos de arrastre
        card.addEventListener('dragstart', (e) => this.handleDragStart(e));
        card.addEventListener('dragend', (e) => this.handleDragEnd(e));

        return col;
    }

    initEventListeners() {
        // Eventos de filtro
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filtroActual = e.target.dataset.filter;
                document.querySelectorAll('[data-filter]').forEach(b => 
                    b.classList.toggle('active', b === e.target));
                this.mostrarVoluntariados();
            });
        });

        // Eventos de la zona de selección
        const seleccionContainer = document.getElementById('seleccion-container');
        
        seleccionContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            seleccionContainer.classList.add('dragover');
        });

        seleccionContainer.addEventListener('dragleave', () => {
            seleccionContainer.classList.remove('dragover');
        });

        seleccionContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            seleccionContainer.classList.remove('dragover');
            
            const id = e.dataTransfer.getData('text/plain');
            const voluntariado = this.voluntariados.find(v => v.id.toString() === id);
            
            if (voluntariado && !this.seleccionados.has(id)) {
                this.agregarASeleccion(voluntariado);
                this.seleccionados.add(id);
            }
        });
    }

    agregarASeleccion(voluntariado) {
        const seleccionContainer = document.getElementById('seleccion-container');
        const elemento = document.createElement('div');
        elemento.className = 'card mb-2';
        elemento.dataset.id = voluntariado.id;

        const badgeClass = voluntariado.tipo === 'Oferta' ? 'bg-success' : 'bg-primary';

        elemento.innerHTML = `
            <div class="card-body py-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${voluntariado.titulo}</h6>
                        <small class="text-muted">${new Date(voluntariado.fecha).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <span class="badge ${badgeClass} me-2">${voluntariado.tipo}</span>
                        <button class="btn btn-sm btn-outline-danger" onclick="dashboard.quitarDeSeleccion('${voluntariado.id}')">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        seleccionContainer.appendChild(elemento);
    }

    quitarDeSeleccion(id) {
        const elemento = document.querySelector(`#seleccion-container [data-id="${id}"]`);
        if (elemento) {
            elemento.remove();
            this.seleccionados.delete(id);
        }
    }

    handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    mostrarUsuarioActivo() {
        const usuarioActivo = GestionUsuarioActivo.obtenerUsuarioActivo();
        const elementoUsuarioActivo = document.getElementById('nav-user');
        elementoUsuarioActivo.textContent = usuarioActivo ? usuarioActivo.nombre : '-no login-';
    }
}

// Crear instancia global
window.dashboard = new DashboardVoluntariados();