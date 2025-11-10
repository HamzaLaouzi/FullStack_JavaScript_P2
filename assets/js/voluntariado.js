/**
* lógica del fichero voluntariado.html
*/

import { showActiveUser, startDataBase, addCardsInTable, addCardDB, getChartData, loadUsersToStorage } from "./almacenaje.js"

// declaramos constantes para obtener el ID de diferentes elementos del DOM
const submitButton = document.getElementById("submitId")
//const volTable = document.getElementById("volTableId")


// listener para añadir un nuevo registro a la BBDD
submitButton.addEventListener("click", addCardDB)

// listeners para mostrar el usuario activo del WebStorage e iniciar la BBDD 
window.addEventListener("DOMContentLoaded", () => {
    console.log("=== voluntariado.js DOMContentLoaded ===")
    
    // Cargar usuarios primero (síncrono)
    loadUsersToStorage()
    showActiveUser()
    
    // Iniciar la base de datos con callback para sincronización
    startDataBase(() => {
        console.log("=== Callback ejecutado - BD lista, cargando visualizaciones ===")
        // Estas funciones solo se ejecutan cuando la BD está completamente lista
        addCardsInTable()
        getChartData()
    })
})