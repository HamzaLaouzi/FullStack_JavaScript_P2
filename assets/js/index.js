/**
* lógica del fichero index.html
*/

// importamos las funciones necesarias desde "almacenaje.js"
import { showActiveUser, loadUsersToStorage, startDataBase, getCardsFromDB, moveCard, loadSelectedCards } from './almacenaje.js'

// declaramos constantes para identificar los 2 contenedores y las hacemos globales
window.dragContainer = document.getElementById("dragContainer")
window.dropContainer = document.getElementById("dropContainer")

const dragContainer = window.dragContainer
const dropContainer = window.dropContainer

// ==========================================================
//  DRAG & DROP
// ==========================================================

// listener para que las tarjetas del "dropContainer" (Selección) sean droppable
dropContainer.addEventListener("dragover", (e) => {
    e.preventDefault()
    dropContainer.style.backgroundColor = "rgba(0, 0, 0, 0.08)" // efecto visual al arrastrar
})

dropContainer.addEventListener("dragleave", () => {
    dropContainer.style.backgroundColor = "" // elimina efecto visual
})

dropContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    dropContainer.style.backgroundColor = "" // elimina efecto visual

    const cardTitleSafe = e.dataTransfer.getData("text/plain")
    if (!cardTitleSafe) return

    // mover SIEMPRE de disponibles a selección
    moveCard(cardTitleSafe, dragContainer, dropContainer)
})

// listener para que las tarjetas del "dragContainer" (Disponibles) sean droppable
dragContainer.addEventListener("dragover", (e) => {
    e.preventDefault()
    dragContainer.style.backgroundColor = "rgba(0, 0, 0, 0.08)" // efecto visual al arrastrar
})

dragContainer.addEventListener("dragleave", () => {
    dragContainer.style.backgroundColor = "" // elimina efecto visual
})

dragContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    dragContainer.style.backgroundColor = "" // elimina efecto visual

    const cardTitleSafe = e.dataTransfer.getData("text/plain")
    if (!cardTitleSafe) return

    // mover SIEMPRE de selección a disponibles
    moveCard(cardTitleSafe, dropContainer, dragContainer)
})

// ==========================================================
//  FILTRO DE TABS (Peticiones / Ofertas / Todas)
// ==========================================================

let currentFilter = "todos"

function applyFilter(filter) {
    currentFilter = filter

    if (!dragContainer) return

    const cards = dragContainer.querySelectorAll(".dragBox")

    cards.forEach(card => {
        const type = card.dataset.volunType  // "Petición" o "Oferta"

        if (filter === "todos" || !type) {
            card.classList.remove("d-none")
        } else {
            if (type === filter) {
                card.classList.remove("d-none")
            } else {
                card.classList.add("d-none")
            }
        }
    })
}

function initFilterTabs() {
    const tabPeticiones = document.getElementById("tab-peticiones")
    const tabOfertas = document.getElementById("tab-ofertas")
    const tabTodas = document.getElementById("tab-todas")

    if (!tabPeticiones || !tabOfertas || !tabTodas) return

    const buttons = [tabPeticiones, tabOfertas, tabTodas]

    function setActive(btn) {
        buttons.forEach(b => {
            b.classList.remove("btn-primary")
            b.classList.add("btn-outline-primary")
        })
        btn.classList.remove("btn-outline-primary")
        btn.classList.add("btn-primary")
    }

    tabPeticiones.addEventListener("click", () => {
        setActive(tabPeticiones)
        applyFilter("Petición")
    })

    tabOfertas.addEventListener("click", () => {
        setActive(tabOfertas)
        applyFilter("Oferta")
    })

    tabTodas.addEventListener("click", () => {
        setActive(tabTodas)
        applyFilter("todos")
    })
}

// ==========================================================
//  INICIALIZACIÓN
// ==========================================================

window.addEventListener("DOMContentLoaded", () => {
    console.log("=== index.js DOMContentLoaded ===")

    // Cargar usuarios primero (síncrono)
    loadUsersToStorage()
    showActiveUser()

    // Iniciar la base de datos con callback para sincronización
    startDataBase(() => {
        console.log("=== Callback ejecutado en index.js - BD lista ===")
        // Estas funciones solo se ejecutan cuando la BD está completamente lista
        getCardsFromDB()
        loadSelectedCards()
    })

    // Inicializar tabs de filtro
    initFilterTabs()
})
