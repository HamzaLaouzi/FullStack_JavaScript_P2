/* Carga de datos iniciales desde datos y claves localstorage --------------------------------------------------------------*/
import { usuarios as usuariosIniciales, voluntariados as voluntariadosIniciales } from "./datos.js";

const KEY_USUARIOS = "usuarios";
const KEY_VOLUNTARIADOS = "voluntariados";
const KEY_USUARIO_ACTIVO = "usuarioActivo";

/* Si no existen el localstorage cargar desde datos -----------------------------------------*/
function datosIniciales() {
    if (!localStorage.getItem(KEY_USUARIOS)) {
        localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuariosIniciales));
    }
    if (!localStorage.getItem(KEY_VOLUNTARIADOS)) {
        localStorage.setItem(KEY_VOLUNTARIADOS, JSON.stringify(voluntariadosIniciales));
    }
}

datosIniciales();

/* USUARIOS -------------------------------------------------------------------------------------------------------------- */
/* Obtener y guardar usuarios -------------------------------------------------------------- */
export function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem(KEY_USUARIOS)) || [];
}
export function guardarUsuarios(lista) {
    localStorage.setItem(KEY_USUARIOS, JSON.stringify(lista));
}

/* VOLUNTARIADOS -------------------------------------------------------------------------------------------------------------- */
/* Obtener y guardar voluntariados --------------------------------------------------------- */
export function obtenerVoluntariados() {
    return JSON.parse(localStorage.getItem(KEY_VOLUNTARIADOS)) || [];
}

export function guardarVoluntariados(lista) {
    localStorage.setItem(KEY_VOLUNTARIADOS, JSON.stringify(lista));
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
