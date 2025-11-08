import * as almacenaje from "./almacenaje.js";

/* MOSTRAR VOLUNTARIADOS -----------------------------------------------------------------------------------------*/
export async function mostrarVoluntariados() {
    const lista = await almacenaje.obtenerVoluntariados();
    const cont = document.getElementById("lista-voluntariados");
    cont.innerHTML = "";

    lista.forEach(vol => {
        const fila = document.createElement("div");
        fila.className = "row row-cols-6 border-bottom py-2";
        fila.innerHTML = `
            <div class="col">${vol.titulo}</div>
            <div class="col">${vol.usuario}</div>
            <div class="col">${vol.fecha}</div>
            <div class="col">${vol.descripcion}</div>
            <div class="col">${vol.tipo}</div>
            <div class="col text-center">
                <button class="btn btn-danger btn-sm" data-id="${vol.id}">Borrar</button>
            </div>
        `;
        cont.appendChild(fila);
    });

    document.querySelectorAll("[data-id]").forEach(btn => {
        btn.addEventListener("click", async () => {
            await almacenaje.borrarVoluntariado(btn.dataset.id);
            await mostrarVoluntariados();
            await dibujarGrafico();
        });
    });
}

/* CREAR VOLUNTARIADOS -----------------------------------------------------------------------------------------*/
async function altaVoluntariado(e) {
    e.preventDefault();

    const nuevo = {
        titulo: document.getElementById("alta-vol-titulo").value.trim(),
        usuario: document.getElementById("alta-vol-usuario").value.trim(),
        fecha: document.getElementById("alta-vol-fecha").value.trim(),
        descripcion: document.getElementById("alta-vol-desc").value.trim(),
        tipo: document.getElementById("alta-vol-tipo").value
    };

    if (!nuevo.titulo || !nuevo.usuario || !nuevo.fecha) {
        alert("Campos obligatorios.");
        return;
    }

    await almacenaje.guardarVoluntariado(nuevo);
    await mostrarVoluntariados();
    await dibujarGrafico();

    e.target.reset();
}

/* FORMULARIO -------------------------------------------------------------------------------------------------------*/
export function formConnect() {
    const form = document.querySelector("#voluntariados form");
    form.addEventListener("submit", altaVoluntariado);
}

/* CANVAS -----------------------------------------------------------------------------------------------------------*/
export async function dibujarGrafico() {
    const canvas = document.getElementById("graficoCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const lista = await almacenaje.obtenerVoluntariados();
    if (!lista.length) return;

    const usuarios = {}; /* Ajustar por usaurio */
    lista.forEach(v => {
        if (!usuarios[v.usuario]) {
            usuarios[v.usuario] = { peticion: 0, oferta: 0 };
        }

        if (v.tipo === "Petición") usuarios[v.usuario].peticion++;
        else usuarios[v.usuario].oferta++;
    });

    const arrayUsuarios = Object.keys(usuarios);
    const maxNumero = Math.max(...arrayUsuarios.map(u =>
        Math.max(usuarios[u].peticion, usuarios[u].oferta)
    ));

    const ejeX = 400;
    const margenIzquierda = 100;
    const anchoUsuario = 120;

    /* Columnas */
    ctx.beginPath();
    ctx.moveTo(margenIzquierda, 20);
    ctx.lineTo(margenIzquierda, ejeX);
    ctx.lineTo(canvas.width - 20, ejeX);
    ctx.stroke();
    ctx.font = "14px Arial";
    for (let i = 0; i <= maxNumero; i++) {
        const y = ejeX - (i * 300 / maxNumero);
        ctx.fillText(i, margenIzquierda - 25, y + 5);
    }

    arrayUsuarios.forEach((usr, index) => {
        const baseX = margenIzquierda + 50 + index * anchoUsuario;
        const { peticion, oferta } = usuarios[usr];

        const altPet = (peticion / maxNumero) * 300;
        const altOfe = (oferta / maxNumero) * 300;

        /* Estilos petición, oferta y usuario */
        ctx.fillStyle = "#007bff";
        ctx.fillRect(baseX, ejeX - altPet, 40, altPet);

        ctx.fillStyle = "#ff8800";
        ctx.fillRect(baseX + 45, ejeX - altOfe, 40, altOfe);

        ctx.fillStyle = "black";
        ctx.save();
        ctx.translate(baseX + 20, ejeX + 20);
        ctx.rotate(-Math.PI / 5);
        ctx.fillText(usr, 0, 0);
        ctx.restore();
    });
}

