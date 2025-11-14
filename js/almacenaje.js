// almacenaje.js

// -------------------- USUARIOS (localStorage) --------------------
const LS_USERS = 'usuarios';
const LS_USER_ACTIVO = 'usuarioActivo';

export function crearUsuario(user) {
  const usuarios = JSON.parse(localStorage.getItem(LS_USERS)) || [];
  if (usuarios.some(u => u.email === user.email)) return false;
  usuarios.push(user);
  localStorage.setItem(LS_USERS, JSON.stringify(usuarios));
  return true;
}

export function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem(LS_USERS)) || [];
}

export function borrarUsuario(email) {
  const usuarios = obtenerUsuarios().filter(u => u.email !== email);
  localStorage.setItem(LS_USERS, JSON.stringify(usuarios));
}

export function guardarUsuarioActivo(user) {
  localStorage.setItem(LS_USER_ACTIVO, JSON.stringify(user));
}

export function obtenerUsuarioActivo() {
  return JSON.parse(localStorage.getItem(LS_USER_ACTIVO));
}

export function cerrarSesion() {
  localStorage.removeItem(LS_USER_ACTIVO);
}

export function loguearUsuario(email, password) {
  const user = obtenerUsuarios().find(u => u.email === email && u.password === password);
  if (!user) return null;
  guardarUsuarioActivo(user);
  return user;
}

// -------------------- INDEXEDDB (voluntariados + selección) --------------------
const DB_NAME = 'teamscript_db';
const DB_VERSION = 1;
const OS_VOL = 'voluntariados';
const OS_SEL = 'selecciones'; // clave: email, valor: { email, items: [volId,...] }

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = req.result;
      // voluntariados: keyPath id
      if (!db.objectStoreNames.contains(OS_VOL)) {
        const volStore = db.createObjectStore(OS_VOL, { keyPath: 'id' });
        volStore.createIndex('tipo', 'tipo', { unique: false });
        volStore.createIndex('email', 'email', { unique: false });
        volStore.createIndex('fecha', 'fecha', { unique: false });
      }
      // selecciones: key email
      if (!db.objectStoreNames.contains(OS_SEL)) {
        db.createObjectStore(OS_SEL, { keyPath: 'email' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Voluntariados
export async function addVol(vol) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OS_VOL, 'readwrite');
    tx.objectStore(OS_VOL).add(vol);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getAllVols() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OS_VOL, 'readonly');
    const req = tx.objectStore(OS_VOL).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteVol(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OS_VOL, 'readwrite');
    tx.objectStore(OS_VOL).delete(id);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

// Selección por usuario (dashboard)
export async function getSeleccion(email) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OS_SEL, 'readonly');
    const req = tx.objectStore(OS_SEL).get(email);
    req.onsuccess = () => {
      const data = req.result;
      resolve(data ? data.items : []);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addSeleccion(email, volId) {
  const db = await openDB();
  return new Promise(async (resolve, reject) => {
    const tx = db.transaction(OS_SEL, 'readwrite');
    const store = tx.objectStore(OS_SEL);
    const currentReq = store.get(email);
    currentReq.onsuccess = () => {
      const current = currentReq.result || { email, items: [] };
      if (!current.items.includes(volId)) current.items.push(volId);
      store.put(current);
    };
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function removeSeleccion(email, volId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OS_SEL, 'readwrite');
    const store = tx.objectStore(OS_SEL);
    const currentReq = store.get(email);
    currentReq.onsuccess = () => {
      const current = currentReq.result;
      if (!current) { resolve(true); return; }
      current.items = current.items.filter(id => id !== volId);
      store.put(current);
    };
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}
