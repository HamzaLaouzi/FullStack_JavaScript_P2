// Contenido original de assets/js/datos.js
const usuarios = [
    {
        nombre: 'Hamza',
        email: 'hamza@hamza.com',
        password: '123'
    },
    {
        nombre: 'Carmen',
        email: 'carmen@carmen.com',
        password: '123'
    }
]

const anuncios = [
    {
        date: "01/10/2025",
        title: "Madrid",
        description: "Chico responsable se ofrece a llevar a nuestros mayores al hospital de fuenlabrada de L-V mañana",
        autor: usuarios[0].nombre,
        volunType: "Oferta"
    },
    {
        date: "02/10/2025",
        title: "Valencia",
        description: "Chica responsable se ofrece a llevar a nuestros mayores al hospital de valencia de Lunes y miercoles mañana",
        autor: usuarios[1].nombre,
        volunType: "Oferta"
    },
    {
        date: "02/10/2025",
        title: "Barcelona",
        description: "Se busca una chica responsable para llevar a nuestros mayores al hospital de barcelona los martes por la tarde",
        autor: usuarios[1].nombre,
        volunType: "Petición"
    }
]

// Exponer como variables globales para uso sin ES Modules
window.usuarios = usuarios
window.anuncios = anuncios

// Las funciones de sesión se han movido a almacenaje.js

// Eliminar el código original de aquí:
/*
window.getCurrentUser = function() {
    const userStr = localStorage.getItem('currentUser')
    return userStr ? JSON.parse(userStr) : null
}

window.setCurrentUser = function(user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
}

window.logout = function() {
    localStorage.removeItem('currentUser')
    window.location.href = 'login.html'
}
*/