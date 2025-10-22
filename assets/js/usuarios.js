import { AlmacenajeUsuarios, GestionUsuarioActivo } from './almacenaje.js';

class GestionUsuarios {
    constructor() {
        this.almacenaje = new AlmacenajeUsuarios();
        this.initEventListeners();
        this.actualizarTablaUsuarios();
        this.mostrarUsuarioActivo();
    }

    initEventListeners() {
        // Evento para el formulario de alta de usuario
        document.getElementById('formAltaUsuario').addEventListener('submit', (e) => {
            e.preventDefault();
            this.altaUsuario();
        });
    }

    altaUsuario() {
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Verificar si el usuario ya existe
        if (this.almacenaje.buscarUsuario(email)) {
            alert('Ya existe un usuario con ese correo electrónico');
            return;
        }

        // Crear y guardar el nuevo usuario
        const usuario = { nombre, email, password };
        this.almacenaje.guardarUsuario(usuario);
        
        // Limpiar formulario y actualizar tabla
        document.getElementById('formAltaUsuario').reset();
        this.actualizarTablaUsuarios();
    }

    actualizarTablaUsuarios() {
        const tbody = document.getElementById('tablaUsuarios');
        tbody.innerHTML = '';

        this.almacenaje.obtenerUsuarios().forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>********</td>
                <td>
                    <button onclick="gestionUsuarios.eliminarUsuario('${usuario.email}')">
                        Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    eliminarUsuario(email) {
        if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            this.almacenaje.eliminarUsuario(email);
            this.actualizarTablaUsuarios();
        }
    }

    mostrarUsuarioActivo() {
        const usuarioActivo = GestionUsuarioActivo.obtenerUsuarioActivo();
        const elementoUsuarioActivo = document.getElementById('usuarioActivo');
        elementoUsuarioActivo.textContent = usuarioActivo ? usuarioActivo.nombre : '-no login-';
    }
}

// Crear instancia global para poder acceder desde el HTML
window.gestionUsuarios = new GestionUsuarios();