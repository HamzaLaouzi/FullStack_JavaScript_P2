/**
 * Módulo almacenaje.js
 * Centraliza todas las operaciones de CRUD con WebStorage (localStorage) e IndexedDB.
 */

// --- Variables y Constantes para WebStorage ---
const USER_STORAGE_KEY = 'currentUser';
const USERS_LIST_KEY = 'users'; // Clave para la lista de usuarios

// -----------------------------------------------------------------
// --- Lógica CRUD de SESIÓN/USUARIOS (WebStorage/localStorage) ---
// -----------------------------------------------------------------

export function obtenerUsuarioActivo() {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

export function establecerUsuarioActivo(user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function cerrarSesion() {
    localStorage.removeItem(USER_STORAGE_KEY);
}

export function inicializarUsuarios(initialUsers) {
    if (!localStorage.getItem(USERS_LIST_KEY)) {
        localStorage.setItem(USERS_LIST_KEY, JSON.stringify(initialUsers));
    }
}

export function obtenerUsuarios() {
    const usersStr = localStorage.getItem(USERS_LIST_KEY);
    return usersStr ? JSON.parse(usersStr) : []; 
}

export function guardarUsuario(newUser) {
    const usuarios = obtenerUsuarios(); 
    usuarios.push(newUser);
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(usuarios));
}

export function eliminarUsuario(indice) {
    const usuarios = obtenerUsuarios();
    
    if (indice >= 0 && indice < usuarios.length) {
        const currentUser = obtenerUsuarioActivo();
        if (currentUser && currentUser.email === usuarios[indice].email) {
            throw new Error("No se puede eliminar el usuario activo.");
        }

        usuarios.splice(indice, 1);
        localStorage.setItem(USERS_LIST_KEY, JSON.stringify(usuarios)); 
    } else {
        throw new Error("Índice de usuario inválido.");
    }
}


// -----------------------------------------------------------------
// --- Lógica CRUD de VOLUNTARIADOS (IndexedDB) ---
// -----------------------------------------------------------------

const DB_NAME = 'VoluntariadoDB';
const DB_VERSION = 1;
const STORE_NAME = 'anuncios';

let db;

/**
 * Función que abre la conexión a IndexedDB y la inicializa.
 * @param {Array} initialAnuncios Datos iniciales de datos.js
 */
export function openDB(initialAnuncios) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('Error al abrir IndexedDB:', event.target.errorCode);
            reject('Error al abrir la base de datos.');
        };

        // Evento clave: Se dispara cuando la versión es nueva (primera vez o cambio de esquema)
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            // Creamos el almacén de objetos (tabla) con 'id' autoincremental
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            
            // Carga inicial de datos desde datos.js
            if (initialAnuncios && initialAnuncios.length > 0) {
                console.log('Cargando datos iniciales de voluntariados...');
                initialAnuncios.forEach(anuncio => {
                    store.add(anuncio); // Añade el objeto y IndexedDB le asigna un 'id'
                });
            }
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };
    });
}

/**
 * Wrapper para transacciones. Encapsula la lógica asíncrona de IndexedDB.
 */
function transaction(mode, callback) {
    return new Promise((resolve, reject) => {
        if (!db) return reject('La base de datos no está abierta.');

        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);

        tx.oncomplete = () => resolve(store.result);
        tx.onerror = (event) => reject(event.target.error);

        try {
            callback(store, resolve, reject);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Obtiene todos los voluntariados de IndexedDB.
 */
export async function obtenerVoluntariadosDB() {
    return transaction('readonly', (store, resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
    });
}

/**
 * Guarda (añade/actualiza) un voluntariado.
 */
export async function guardarVoluntariadoDB(voluntariado) {
    return transaction('readwrite', (store, resolve) => {
        // Si no tiene ID, es nuevo (add). Si tiene ID, actualiza (put).
        const request = voluntariado.id ? store.put(voluntariado) : store.add(voluntariado);
        request.onsuccess = () => resolve(request.result);
    });
}

/**
 * Elimina un voluntariado por su ID.
 * Usamos el ID generado por IndexedDB como clave primaria.
 */
export async function eliminarVoluntariadoDB(voluntariadoId) {
    return transaction('readwrite', (store, resolve) => {
        const request = store.delete(voluntariadoId);
        request.onsuccess = () => resolve();
    });
}