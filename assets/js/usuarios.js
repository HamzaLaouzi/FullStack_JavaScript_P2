// CORRECCIÓN: Importa las funciones directamente desde almacenaje.js
import { obtenerUsuarioActivo, obtenerUsuarios, guardarUsuario, eliminarUsuario } from './almacenaje.js';

class GestionUsuarios {
    constructor() {
        this.initEventListeners();
        this.actualizarTablaUsuarios();
        this.mostrarUsuarioActivo();
    }

    initEventListeners() {
        document.getElementById('formAltaUsuario').addEventListener('submit', (e) => {
            e.preventDefault();
            this.altaUsuario();
        });
    }

    altaUsuario() {
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!nombre || !email || !password) {
             alert('Todos los campos son obligatorios');
             return;
        }

        if (obtenerUsuarios().some(u => u.email === email)) {
            alert('Ya existe un usuario con ese correo electrónico');
            return;
        }

        const usuario = { nombre, email, password };
        guardarUsuario(usuario);
        
        document.getElementById('formAltaUsuario').reset();
        this.actualizarTablaUsuarios();
        alert('Usuario creado correctamente.');
    }

    actualizarTablaUsuarios() {
        const tbody = document.getElementById('tablaUsuarios');
        tbody.innerHTML = '';

        // Ahora itera y usa el índice para la función de borrado
        obtenerUsuarios().forEach((usuario, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>${usuario.password.replace(/./g, '*')}</td> <td>
                    <button class="btn btn-sm btn-danger" onclick="window.gestionUsuarios.eliminarUsuarioPorIndice(${index})">
                        Eliminar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Exponemos la función globalmente para el evento onclick en el HTML
    eliminarUsuarioPorIndice(index) {
        if (!obtenerUsuarioActivo()) {
            alert('Debes iniciar sesión para eliminar usuarios');
            return;
        }
        
        if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
            try {
                eliminarUsuario(index); 
                this.actualizarTablaUsuarios();
            } catch (error) {
                alert(error.message);
            }
        }
    }

    mostrarUsuarioActivo() {
        const usuarioActivo = obtenerUsuarioActivo();
        const elementoUsuarioActivo = document.getElementById('usuarioActivo'); 
        if (elementoUsuarioActivo) {
            elementoUsuarioActivo.textContent = usuarioActivo ? usuarioActivo.nombre : '-no login-';
        }
    }
}

// Crear instancia global
window.gestionUsuarios = new GestionUsuarios();