// Datos de usuarios y anuncios para la aplicación
const usuarios = [
    {
        name: 'Hamza',
        email: 'hamza@hamza.com',
        password: '123'
    },
    {
        name: 'Carmen',
        email: 'carmen@carmen.com',
        password: '123'
    }
];

const anuncios = [
    {
        date: "01/10/2025",
        title: "Madrid",
        description: "Chico responsable se ofrece a llevar a nuestros mayores al hospital de fuenlabrada de L-V mañana",
        autor: 'Hamza',
        email: 'hamza@hamza.com',
        volunType: "Oferta"
    },
    {
        date: "02/10/2025",
        title: "Valencia",
        description: "Chica responsable se ofrece a llevar a nuestros mayores al hospital de valencia de Lunes y miercoles mañana",
        autor: 'Carmen',
        email: 'carmen@carmen.com',
        volunType: "Oferta"
    },
    {
        date: "02/10/2025",
        title: "Barcelona",
        description: "Se busca una chica responsable para llevar a nuestros mayores al hospital de barcelona los martes por la tarde",
        autor: 'Carmen',
        email: 'carmen@carmen.com',
        volunType: "Petición"
    }
];

export { usuarios, anuncios }
