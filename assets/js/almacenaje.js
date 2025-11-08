/* Carga de datos iniciales desde datos y claves localstorage --------------------------------------------------------------*/
import { usuarios as usuariosIniciales, voluntariados as voluntariadosIniciales } from "./datos.js";

const KEY_USUARIOS = "usuarios";
/**/
const KEY_USUARIO_ACTIVO = "usuarioActivo";

/* Si no existen el localstorage cargar desde datos -----------------------------------------*/
function datosInicialesUsuarios() {
    if (!localStorage.getItem(KEY_USUARIOS)) {
        localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuariosIniciales));
    }
}
datosInicialesUsuarios();

/* USUARIOS -------------------------------------------------------------------------------------------------------------- */
/* Obtener y guardar usuarios -------------------------------------------------------------- */
export function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem(KEY_USUARIOS)) || [];
}
export function guardarUsuarios(lista) {
    localStorage.setItem(KEY_USUARIOS, JSON.stringify(lista));
}

/* VOLUNTARIADOS -------------------------------------------------------------------------------------------------------------- */
/* Indexed DB ------------------------------------------------------------------------------ */
const DB_NAME = "VoluntariadosDB";
const STORE = "voluntariados";

/* Empezar la base de datos -------------------------------------------------------------------*/
function startDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);

        req.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE)) {
                const store = db.createObjectStore(STORE, {
                    keyPath: "id",
                    autoIncrement: true
                });

                voluntariadosIniciales.forEach(v => store.add(v)); /* Datos iniciales array para la primera vez */
            }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/* Obntener voluntariado -------------------------------------------------------------------*/
export async function obtenerVoluntariados() {
    const db = await startDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const store = tx.objectStore(STORE);
        const req = store.getAll();

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

/* Guardar voluntariado ---------------------------------------------------------------------*/
export async function guardarVoluntariado(vol) {
    const db = await startDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);
        const req = store.add(vol);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

/* Eliminar voluntariado ------------------------------------------------------------------*/
export async function borrarVoluntariado(id) {
    const db = await startDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);
        const req = store.delete(Number(id));

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

/* USUARIO ACTIVO -------------------------------------------------------------------------------------------------------------- */
export function obtenerUsuarioActivo() {
    return localStorage.getItem(KEY_USUARIO_ACTIVO);
}

export function guardarUsuarioActivo(email) {
    localStorage.setItem(KEY_USUARIO_ACTIVO, email);
}

export function limpiarUsuarioActivo() {
    localStorage.removeItem(KEY_USUARIO_ACTIVO);
}

/* LOGIN ----------------------------------------------------------------------------------------------------------------- */
export function loguearUsuario(email, contraseña) {
    const usuarios = obtenerUsuarios();

    const usuarioValido = usuarios.find(u =>
        u.email === email && u.contraseña === contraseña
    );

    if (usuarioValido) {
        guardarUsuarioActivo(usuarioValido.email);
        return true;
    }
    return false;
}
