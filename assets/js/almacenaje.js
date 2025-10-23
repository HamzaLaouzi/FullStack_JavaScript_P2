/**
 * fichero con funciones para realizar la lógica CRUD
*/

// importamos el array de "users"
import { usuarios, anuncios } from "./datos.js"

// función que verificará si hay algún dato (clave user -> email) en el WebStorage
export function showActiveUser() {
    const domUserLogged = document.getElementById("activeUser") || document.getElementById("nav-user")

    if (!domUserLogged) return

    let user = localStorage.getItem("activeUser")

    if (user) {
        domUserLogged.textContent = user
    } else {
        domUserLogged.textContent = "-no login-"
    }
}

// realiza un login utilizando y verificando los datos del WebStorage
export function loginUser() {
    const domInputEmail = document.getElementById("loginInputEmail")
    const domInputPassword = document.getElementById("loginInputPassword")

    let email = domInputEmail.value
    let password = domInputPassword.value
    let actualUsers = localStorage.getItem("storageUsers")
    actualUsers = JSON.parse(localStorage.getItem("storageUsers"))
    let userExists = false

    for (let user of actualUsers) {
        if (user.email === email && user.password === password) {
            alert("Se ha iniciado sesión correctamente")
            localStorage.setItem("activeUser", email)
            userExists = true
            break
        }
    }

    if (!userExists) {
        alert("Dirección de correo o contraseña incorrectos")
    }

    showActiveUser()
}

// carga los usuarios al WebStorage con la carga del DOM
export function loadUsersToStorage() {
    console.log("=== loadUsersToStorage() ejecutándose ===")
    console.log("Usuarios importados desde datos.js:", usuarios)
    
    let storedUsers = localStorage.getItem("storageUsers")
    if (!storedUsers) {
        // Usar la variable 'usuarios' importada de datos.js
        localStorage.setItem("storageUsers", JSON.stringify(usuarios))
        console.log("✅ Usuarios cargados en localStorage:", usuarios)
    } else {
        console.log("ℹ️ Usuarios ya existen en localStorage:", JSON.parse(storedUsers))
    }
}

// obtiene los usuarios del WebStorage y los devuelve en un objeto (si no los encuentra los carga del array "usuarios")
function getDefaultUsers() {
    let usersInStorage = localStorage.getItem("storageUsers")
    if (!usersInStorage) {
        localStorage.setItem("storageUsers", JSON.stringify(usuarios))
        return usuarios
    }
    return JSON.parse(usersInStorage)
}

// obtiene el array de objetos de usuarios del WebStorage y añade el nuevo usuario al array
function addUserArray(newUser) {
    let newArrayUsers = getDefaultUsers()

    newArrayUsers.push(newUser)
    localStorage.setItem("storageUsers", JSON.stringify(newArrayUsers))
}

// crea un nuevo usuario con los datos obtenidos del DOM. Lo añade al array de objetos de usuarios
// verifica si el usuario ya existe en el WebStorage
export function addNewUser(event) {
    event.preventDefault()

    // Soportar ambos conjuntos de IDs para compatibilidad con diferentes formularios
    let userName = document.getElementById("nombre")?.value || document.getElementById("userNameId")?.value
    let userEmail = document.getElementById("email")?.value || document.getElementById("userEmailId")?.value
    let userPassword = document.getElementById("password")?.value || document.getElementById("userPasswordId")?.value
    
    let actualUsers = JSON.parse(localStorage.getItem("storageUsers"))
    let usersExists = actualUsers.some(user => user.email === userEmail)

    if (usersExists) {
        alert("El usuario ya existe en el sistema")
    } else {
        if (userName && userEmail && userPassword) {
            let newUser = { name: userName, email: userEmail, password: userPassword }
            addUserArray(newUser)
            alert("Nuevo usuario registrado correctamente")

            // Limpiar ambos conjuntos de campos
            if (document.getElementById("nombre")) document.getElementById("nombre").value = ""
            if (document.getElementById("email")) document.getElementById("email").value = ""
            if (document.getElementById("password")) document.getElementById("password").value = ""
            if (document.getElementById("userNameId")) document.getElementById("userNameId").value = ""
            if (document.getElementById("userEmailId")) document.getElementById("userEmailId").value = ""
            if (document.getElementById("userPasswordId")) document.getElementById("userPasswordId").value = ""

            showUsersTable()
        } else {
            alert("Faltan datos para añadir registro")
        }
    }
}

// añade una nueva fila utilizando los datos del usuario que se pasa por parámetro
// se añadirá un "data-email" en cada botón de "Eliminar" para tener identificado cada usuario
function addUserRow(user) {
    const table = document.getElementById("userTableId") || document.getElementById("tablaUsuarios")
    
    if (!table) return
    
    let newRow = table.insertRow()
    let cell1 = newRow.insertCell(0)
    let cell2 = newRow.insertCell(1)
    let cell3 = newRow.insertCell(2)
    let cell4 = newRow.insertCell(3)

    cell1.textContent = user.name
    cell2.textContent = user.email
    cell3.textContent = user.password
    cell4.innerHTML = `<button type="button" class="btn btn-danger delete-button" data-email="${user.email}">Eliminar</button>`
}

// evento para eliminar un usuario con el "click"
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-button")) {
        let userEmail = event.target.getAttribute("data-email")
        let confirmDelete = confirm("¿Estás seguro que deseas eliminar este usuario?")

        if (confirmDelete) {
            deleteUser(userEmail)
            alert("Usuario eliminado correctamente")
        }
    }
})

// crea un array de objetos con los usuarios del WebStorage, elimina el usuario que coincida con el email que se pasa por parámetro
// se actualizan los usuarios del WebStorage y se actualiza la tabla
function deleteUser(email) {

    let actualUsers = JSON.parse(localStorage.getItem("storageUsers"))
    let updatedUsers = actualUsers.filter(user => user.email !== email)

    localStorage.setItem("storageUsers", JSON.stringify(updatedUsers))

    showUsersTable()
}

// muestra una tabla con los usuarios del WebStorage
export function showUsersTable() {
    let actualUsersArray = getDefaultUsers()
    const table = document.getElementById("userTableId") || document.getElementById("tablaUsuarios")
    
    if (!table) {
        console.error("No se encontró la tabla de usuarios")
        return
    }

    // Si es un tbody, solo limpiar el contenido
    if (table.tagName === "TBODY") {
        table.innerHTML = ""
        for (let user of actualUsersArray) {
            addUserRow(user)
        }
    } else {
        // Si es una tabla completa, añadir el header
        table.innerHTML = `
        <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Email</th>
            <th scope="col">Password</th>
            <th scope="col">Acciones</th>
        </tr>
        `
        for (let user of actualUsersArray) {
            addUserRow(user)
        }
    }
}

// ===== FUNCIONES ADICIONALES PARA REGISTRO.JS =====

// Inicializa los usuarios en localStorage si no existen
export function inicializarUsuarios(usuariosIniciales) {
    if (!localStorage.getItem("storageUsers")) {
        localStorage.setItem("storageUsers", JSON.stringify(usuariosIniciales))
        console.log("Usuarios inicializados en localStorage:", usuariosIniciales)
    } else {
        console.log("Usuarios ya existen en localStorage")
    }
}

// Obtiene todos los usuarios del localStorage
export function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("storageUsers")) || []
}

// Guarda un nuevo usuario en localStorage
export function guardarUsuario(usuario) {
    let usuarios = obtenerUsuarios()
    usuarios.push(usuario)
    localStorage.setItem("storageUsers", JSON.stringify(usuarios))
}

// Elimina un usuario por índice
export function eliminarUsuario(indice) {
    let usuarios = obtenerUsuarios()
    if (indice >= 0 && indice < usuarios.length) {
        usuarios.splice(indice, 1)
        localStorage.setItem("storageUsers", JSON.stringify(usuarios))
    }
}

// Obtiene el usuario activo
export function obtenerUsuarioActivo() {
    const email = localStorage.getItem("activeUser")
    if (!email) return null
    
    const usuarios = obtenerUsuarios()
    return usuarios.find(u => u.email === email) || null
}

// Cierra la sesión del usuario activo
export function cerrarSesion() {
    localStorage.removeItem("activeUser")
}

// declaramos una variable "db" para la base de datos
let db
let dbReady = false

// función para crear la base de datos
// verificará mediante listeners si hay algún error, si existe la BBDD la iniciará y si no existe la iniciará y creará el almacén
export function startDataBase() {
    console.log("=== startDataBase() ejecutándose ===")
    console.log("Anuncios importados desde datos.js:", anuncios)
    
    let request = indexedDB.open("VoluntariadoDB", 1)

    request.addEventListener("error", showErrorDB)
    request.addEventListener("upgradeneeded", createStoreDB)
    request.addEventListener("success", initDB)
}

// muestra una alerta en caso que haya un error con la base de datos
function showErrorDB(event) {
    alert("Error: " + event.code + " / " + event.message)
}

// crea un almacén para la BBDD y asigna un "keyPath"
function createStoreDB(event) {
    let db = event.target.result

    // Crear el almacén para los voluntariados
    if (!db.objectStoreNames.contains('Voluntariados')) {
        db.createObjectStore('Voluntariados', { keyPath: 'title' })
    }
    
    // Crear el almacén para las tarjetas seleccionadas
    if (!db.objectStoreNames.contains('TarjetasSeleccionadas')) {
        db.createObjectStore('TarjetasSeleccionadas', { keyPath: 'id', autoIncrement: true })
    }
}

// verifica si hay datos en la BBDD, si no los hay cargará los datos desde "datos.js"
function initDB(event) {
    db = event.target.result
    dbReady = true
    
    // Verificar si hay datos en la BD
    let transaction = db.transaction(["Voluntariados"], "readonly")
    let storeDB = transaction.objectStore("Voluntariados")
    let countRequest = storeDB.count()
    
    countRequest.onsuccess = function() {
        if (countRequest.result === 0) {
            // Si no hay datos, cargarlos desde datos.js
            console.log("BD vacía, cargando datos iniciales...")
            updateCardsDB().then(() => {
                console.log("Datos iniciales cargados correctamente en IndexedDB")
            }).catch(error => {
                console.error("Error al cargar los datos iniciales:", error)
            })
        } else {
            console.log(`BD ya tiene ${countRequest.result} registros`)
        }
    }
}

// carga los objetos de "datos.js" en la BBDD
function updateCardsDB() {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error("Base de datos no inicializada")
            reject("Base de datos no inicializada")
            return
        }
        
        console.log("Insertando anuncios en IndexedDB:", anuncios)
        
        let transaction = db.transaction(["Voluntariados"], "readwrite")
        let storeDB = transaction.objectStore("Voluntariados")

        // Limpiar el almacén antes de insertar nuevos datos
        storeDB.clear().onsuccess = function() {
            // Insertar los anuncios en la base de datos
            anuncios.forEach(anuncio => {
                let request = storeDB.put(anuncio)
                request.onerror = function() {
                    console.error("Error al insertar anuncio:", anuncio)
                }
            })
        }

        transaction.oncomplete = function () {
            console.log("Transacción completada exitosamente")
            resolve()
        }

        transaction.onerror = function (event) {
            console.error("Error en transacción:", event)
            reject("Error al insertar datos en la BBDD")
        }
    })
}

// recorre los registros de la BBDD y llama a la función "showCardsTable" para irlos añadiendo a la tabla
export function addCardsInTable() {
    if (!dbReady) {
        setTimeout(addCardsInTable, 100)
        return
    }

    let table = document.getElementById("volTableId")
    let tableHeader = table.querySelector("tr.table-dark").outerHTML

    table.innerHTML = tableHeader

    let transaction = db.transaction(["Voluntariados"], "readonly")
    let storeDB = transaction.objectStore("Voluntariados")
    let pointer = storeDB.openCursor()

    pointer.addEventListener("success", showCardsTable)
}

// función para añadir filas en una tabla
// le pasaremos el puntero como parámetro para mostrar los datos de forma dinámica
function createRow(pointer) {
    let classColor = pointer.value.volunType === "Oferta" ? "table-primary" : "table-success"
    let newRow = document.createElement("tr")

    newRow.classList.add(classColor, "table-hover")

    newRow.innerHTML += `
        <td class="fw-normal">${pointer.value.email}</td>
        <td class="fw-normal">${pointer.value.date}</td>
        <td class="fw-normal">${pointer.value.title}</td>
        <td class="fw-normal">${pointer.value.description}</td>
        <td class="fw-normal">${pointer.value.volunType}</td>
        <td class="fw-normal">
            <button type="button" class="btn btn-danger delete-vol" data-title="${pointer.value.title}">Eliminar</button>
        </td>
    `
    return newRow
}

// muestra los registros de la BBDD en una tabla
function showCardsTable(event) {
    let pointer = event.target.result
    if (pointer) {
        let tableBody = document.querySelector("#volTableId tbody")
        let newRow = createRow(pointer)

        tableBody.appendChild(newRow)
        pointer.continue()
    }
}

// elimina un registro de la BBDD, se pasará el "keyPath" (title) como parámetro
function deleteCard(key) {
    let transaction = db.transaction(["Voluntariados"], "readwrite")
    let storeDB = transaction.objectStore("Voluntariados")
    let request = storeDB.delete(key)

    request.onsuccess = function () {
        addCardsInTable()
    }
}

// listener para el botón "eliminar" de cada fila
// se hace declarando una constante del Id de la tabla para que no genere conflicto con el resto de interfaces
const volTableId = document.getElementById("volTableId")
if (volTableId) {
    volTableId.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-vol")) {
            let volTitle = event.target.getAttribute("data-title")
            if (confirm("¿Estás seguro que deseas eliminar el voluntariado?")) {
                deleteCard(volTitle)
            }
        }
    })
}

// añade un nuevo registro a la base de datos verificando que no hayan campos vacíos o que el usuario no exista en el WebStorage
export function addCardDB() {
    let email = document.getElementById("newVolEmailId").value.trim()
    let date = document.getElementById("volDateId").value.trim()
    let title = document.getElementById("newVolTitleId").value.trim()
    let description = document.getElementById("newVolDescriptionId").value.trim()
    let volType = document.getElementById("volSelectId").value.trim()

    if (!email || !date || !title || !description || !volType) {
        alert("Faltan campos por rellenar")
        return
    }

    let transaction = db.transaction(["Voluntariados"], "readwrite")
    let storeDB = transaction.objectStore("Voluntariados")

    let request = storeDB.get(title)
    request.onsuccess = function () {
        if (request.result) {
            alert("Ya existe un voluntariado con este título")
        } else {
            let storageUsers = JSON.parse(localStorage.getItem("storageUsers"))
            let userFound = storageUsers.find(user => user.email === email)

            if (userFound) {
                storeDB.put({
                    date: date,
                    title: title,
                    description: description,
                    autor: userFound.name,
                    volunType: volType,
                    email: email
                })
                alert("Voluntariado registrado correctamente")
                setTimeout(() => {
                    addCardsInTable()
                }, 100)
            } else {
                alert("El usuario (email) no está registrado")
            }
        }
    }

    document.getElementById("newVolEmailId").value = ""
    document.getElementById("volDateId").value = ""
    document.getElementById("newVolTitleId").value = ""
    document.getElementById("newVolDescriptionId").value = ""
    document.getElementById("volSelectId").value = ""
    document.getElementById("submitId").value = ""
}


// se genera un canvas con los datos de IndexedDB
export function getChartData() {
    if (!dbReady) {
        setTimeout(getChartData, 100)
        return
    }

    let transaction = db.transaction(["Voluntariados"], "readonly")
    let storeDB = transaction.objectStore("Voluntariados")
    let request = storeDB.getAll()

    request.onsuccess = function (event) {
        let data = event.target.result
        let userStats = {}

        data.forEach(vol => {
            if (!userStats[vol.email]) {
                userStats[vol.email] = { oferta: 0, peticion: 0 }
            }
            if (vol.volunType === "Oferta") {
                userStats[vol.email].oferta++
            } else {
                userStats[vol.email].peticion++
            }
        })

        drawChart(userStats)
    }
}

// se dibuja el gráfico con los datos obtenidos
function drawChart(userStats) {
    let canvas = document.getElementById("canvas")
    let ctx = canvas.getContext("2d")
    canvas.width = 1200
    canvas.height = 400

    let users = Object.keys(userStats)
    let barWidth = 40
    let gap = 50
    let startX = 100
    let maxHeight = 300

    // Calcular el valor máximo dinámicamente
    let maxValue = 0
    users.forEach(user => {
        maxValue = Math.max(maxValue, userStats[user].oferta, userStats[user].peticion)
    })
    
    // Si no hay datos, usar un valor mínimo de 4 para evitar división por cero
    if (maxValue === 0) maxValue = 4

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = "14px Arial"

    // Dibujar eje Y
    ctx.beginPath()
    ctx.moveTo(80, 20)
    ctx.lineTo(80, canvas.height - 50)
    ctx.stroke()

    // Marcas y números del eje Y - ahora dinámico basado en maxValue
    for (let i = 0; i <= maxValue; i++) {
        let y = canvas.height - 50 - (i * (maxHeight / maxValue))
        ctx.fillText(i, 60, y)
        ctx.beginPath()
        ctx.moveTo(75, y)
        ctx.lineTo(85, y)
        ctx.stroke()
    }

    users.forEach((user, index) => {
        let x = startX + index * (barWidth * 2 + gap)
        let ofertaHeight = (userStats[user].oferta / maxValue) * maxHeight
        let peticionHeight = (userStats[user].peticion / maxValue) * maxHeight

        ctx.fillStyle = "#0d6efd"
        ctx.fillRect(x, canvas.height - ofertaHeight - 50, barWidth, ofertaHeight)
        ctx.fillStyle = "#198754"
        ctx.fillRect(x + barWidth, canvas.height - peticionHeight - 50, barWidth, peticionHeight)

        ctx.fillStyle = "black"
        ctx.save()
        ctx.translate(x + barWidth / 2, canvas.height - 5)
        ctx.rotate(-Math.PI / 4)
        ctx.fillText(user, 0, 0)
        ctx.restore()
    })
}

// obtiene las tarjetas de indexedDB y muestra las que no se encuentren en el almacén "TarjetasSeleccionadas"
export function getCardsFromDB() {
    if (!dbReady) {
        setTimeout(getCardsFromDB, 100)
        return
    }
    let request = indexedDB.open("VoluntariadoDB")

    request.onsuccess = function (event) {
        let db = event.target.result
        let selectedTitles = new Set()

        let selectionTransaction = db.transaction(["TarjetasSeleccionadas"], "readonly")
        let selectionStore = selectionTransaction.objectStore("TarjetasSeleccionadas")
        let selectionCursor = selectionStore.openCursor()

        selectionCursor.onsuccess = function (event) {
            let selectionPointer = event.target.result
            if (selectionPointer) {
                selectedTitles.add(selectionPointer.value.title.replace(/\s+/g, '_'))
                selectionPointer.continue()
            } else {
                let transaction = db.transaction(["Voluntariados"], "readonly")
                let storeDB = transaction.objectStore("Voluntariados")
                let pointer = storeDB.openCursor()

                pointer.onsuccess = function (event) {
                    let cursor = event.target.result
                    if (cursor) {
                        let titleSafe = cursor.value.title.replace(/\s+/g, '_')

                        if (!selectedTitles.has(titleSafe)) {
                            showCardInDragContainer(cursor.value)
                        }
                        cursor.continue()
                    }
                }
            }
        }
    }
}

// muestra las tarjetas en el contenedor "Disponibles"
export function showCardInDragContainer(cardData) {
    let titleSafe = cardData.title.replace(/\s+/g, '_')

    let cardElement = document.createElement("div")
    cardElement.classList.add("m-3", "dragBox", "col-6", "col-md-6")
    cardElement.setAttribute("draggable", "true")
    cardElement.setAttribute("data-title", titleSafe)

    cardElement.innerHTML = `
        <div class="card ${cardData.volunType === "Oferta" ? "text-bg-primary" : "text-bg-success"}" style="max-width: 18rem;">
            <div class="card-body">
                <h5 class="card-title fw-bold textPoppinsFont">${cardData.title}</h5>
                <p class="card-text textRockSFont">${cardData.description}</p>
                <p class="card-text fst-italic textPatrickFont">Fecha publicación ${cardData.date}</p>
                <p class="card-text text-decoration-underline textPatrickFont">Publicado por ${cardData.email}</p>
            </div>
        </div>
    `

    cardElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", titleSafe)
    })

    // Usar la variable global definida en index.js
    if (window.dragContainer) {
        window.dragContainer.appendChild(cardElement)
    }
}

// función para mover las tarjetas, recibirá como parámetros el título de la tarjeta (para tenerla identificada), el contenedor de donde proviene y el contenedor al que se moverá
export function moveCard(cardTitleSafe, sourceContainer, targetContainer) {
    let request = indexedDB.open("VoluntariadoDB")

    request.onsuccess = function (event) {
        let db = event.target.result
        let transaction = db.transaction(["Voluntariados"], "readonly")
        let storeDB = transaction.objectStore("Voluntariados")

        let cursorRequest = storeDB.openCursor()
        cursorRequest.onsuccess = function (event) {
            let pointer = event.target.result
            if (pointer) {
                if (pointer.value.title.replace(/\s+/g, '_') === cardTitleSafe) {
                    let existingCard = targetContainer.querySelector(`[data-title="${cardTitleSafe}"]`)
                    if (existingCard) return

                    let cardElement = document.createElement("div")
                    cardElement.classList.add("m-3", "dragBox", "col-6", "col-md-6")
                    cardElement.setAttribute("draggable", "true")
                    cardElement.setAttribute("data-title", cardTitleSafe)
                    cardElement.innerHTML = `
                        <div class="card ${pointer.value.volunType === "Oferta" ? "text-bg-primary" : "text-bg-success"}" style="max-width: 18rem;">
                            <div class="card-body">
                                <h5 class="card-title fw-bold textPoppinsFont">${pointer.value.title}</h5>
                                <p class="card-text textRockSFont">${pointer.value.description}</p>
                                <p class="card-text fst-italic textPatrickFont">Fecha publicación ${pointer.value.date}</p>
                                <p class="card-text text-decoration-underline textPatrickFont">Publicado por ${pointer.value.email}</p>
                            </div>
                        </div>
                    `

                    targetContainer.appendChild(cardElement)

                    cardElement.addEventListener("dragstart", (e) => {
                        e.dataTransfer.setData("text/plain", cardTitleSafe)
                    })

                    let draggedElement = sourceContainer.querySelector(`[data-title="${cardTitleSafe}"]`)
                    if (draggedElement) sourceContainer.removeChild(draggedElement)

                    if (sourceContainer === window.dropContainer && targetContainer === window.dragContainer) {
                        removeSelectedCard(cardTitleSafe)
                    } else if (sourceContainer === window.dragContainer && targetContainer === window.dropContainer) {
                        saveSelectedCard({
                            title: pointer.value.title,
                            description: pointer.value.description,
                            date: pointer.value.date,
                            email: pointer.value.email,
                            volunType: pointer.value.volunType
                        })
                    }
                    return
                }
                pointer.continue()
            }
        }
    }
}

// función para guardar las tarjetas seleccionadas en el almacén "TarjetasSeleccionadas"
export function saveSelectedCard(cardData) {
    let request = indexedDB.open("VoluntariadoDB")

    request.onsuccess = function (event) {
        let db = event.target.result

        let transaction = db.transaction(["TarjetasSeleccionadas"], "readwrite")
        let storeDB = transaction.objectStore("TarjetasSeleccionadas")

        let addRequest = storeDB.add(cardData)

        addRequest.onsuccess = function () {
            console.log("Tarjeta guardada correctamente")
        }

        addRequest.onerror = function (event) {
            console.log("Error al guardar la tarjeta seleccionada", event)
        }
    }
}

// función para cargar las tarjetas que se han seleccionado, es decir, que están en el nuevo almacén "TarjetasSeleccionadas"
export function loadSelectedCards() {
    if (!dbReady) {
        setTimeout(loadSelectedCards, 100)
        return
    }

    let request = indexedDB.open("VoluntariadoDB")

    request.onsuccess = function (event) {
        let db = event.target.result

        let transaction = db.transaction(["TarjetasSeleccionadas"], "readonly")
        let storeDB = transaction.objectStore("TarjetasSeleccionadas")
        let cursorRequest = storeDB.openCursor()

        cursorRequest.onsuccess = function (event) {
            let pointer = event.target.result

            if (pointer) {
                addCardToDropContainer(pointer.value)
                pointer.continue()
            }
        }

        cursorRequest.onerror = function () {
            console.log("Error al cargar las tarjetas guardadas desde el nuevo almacén")
        }
    }
}

// función para añadir tarjetas al contenedor "dropContainer" (Selección)
export function addCardToDropContainer(cardData) {
    let cardElement = document.createElement("div")
    cardElement.classList.add("m-3", "dragBox", "col-6", "col-md-6")
    cardElement.setAttribute("draggable", "true")
    cardElement.setAttribute("data-title", cardData.title.replace(/\s+/g, '_'))

    cardElement.innerHTML = `
    <div class="card ${cardData.volunType === "Oferta" ? "text-bg-primary" : "text-bg-success"}" style="max-width: 18rem;">
        <div class="card-body">
            <h5 class="card-title fw-bold textPoppinsFont">${cardData.title}</h5>
            <p class="card-text textRockSFont">${cardData.description}</p>
            <p class="card-text fst-italic textPatrickFont">Fecha publicación ${cardData.date}</p>
            <p class="card-text text-decoration-underline textPatrickFont">Publicado por ${cardData.email}</p>
        </div>
    </div>
    `
    // Usar la variable global definida en index.js
    if (window.dropContainer) {
        window.dropContainer.appendChild(cardElement)
    }

    cardElement.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", cardData.title.replace(/\s+/g, '_'))
    })
}

// función para eliminar una tarjeta del almacén "TarjetasSeleccionadas"
export function removeSelectedCard(cardTitleSafe) {
    let request = indexedDB.open("VoluntariadoDB")

    request.onsuccess = function (event) {
        let db = event.target.result
        let transaction = db.transaction(["TarjetasSeleccionadas"], "readwrite")
        let storeDB = transaction.objectStore("TarjetasSeleccionadas")

        let getAllRequest = storeDB.getAll()

        getAllRequest.onsuccess = function (event) {
            let allCards = event.target.result
            let targetCard = allCards.find(card => card.title.replace(/\s+/g, '_') === cardTitleSafe)

            if (targetCard) {
                let deleteRequest = storeDB.delete(targetCard.id)
                deleteRequest.onsuccess = () => console.log("Tarjeta eliminada correctamente de IndexedDB")
                deleteRequest.onerror = () => console.log("Error al eliminar la tarjeta de IndexedDB")
            }
        }
    }
}