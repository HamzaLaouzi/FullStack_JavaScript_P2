// init.js
import { addVol, getAllVols } from "./almacenaje.js";

document.addEventListener("DOMContentLoaded", async () => {
  const lista = await getAllVols();

  // Solo inicializa si la base está vacía
  if (lista.length === 0) {
    const ejemplos = [
      {
        id: Date.now(),
        titulo: "Recogida de alimentos",
        email: "voluntario1@example.com",
        fecha: "2025-11-20",
        descripcion: "Ayuda en la recogida de alimentos para familias necesitadas.",
        tipo: "Petición"
      },
      {
        id: Date.now() + 1,
        titulo: "Clases de inglés gratuitas",
        email: "voluntario2@example.com",
        fecha: "2025-11-25",
        descripcion: "Ofrezco clases de inglés para jóvenes.",
        tipo: "Oferta"
      },
      {
        id: Date.now() + 2,
        titulo: "Reforestación en Guardamar",
        email: "voluntario3@example.com",
        fecha: "2025-12-01",
        descripcion: "Actividad de plantación de árboles en la zona costera.",
        tipo: "Petición"
      }
    ];

    for (const vol of ejemplos) {
      await addVol(vol);
    }

    console.log("✅ Voluntariados de ejemplo cargados en IndexedDB");
  }
});
