//FUNCIONES//
// Menu de la pagina 
function mostrarSeccion(id) {
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.style.display = 'none';
    });
    document.getElementById(id).style.display = 'block';
}
//funcion de renderizar cartas
function renderizarCartas(lista) {
    contenedor.innerHTML = "";

    lista.forEach((carta, index) => {
        const cartaHTML = document.createElement("div");
        cartaHTML.classList.add("carta");

        // === HEADER ===
        const headerCarta = document.createElement("div");
        headerCarta.classList.add("carta-header");

        // Nombre (arriba)
        const nombreDiv = document.createElement("div");
        nombreDiv.classList.add("carta-nombre");
        nombreDiv.textContent = carta.name;
        nombreDiv.title = carta.name; 

        const cartaID = document.createElement("div");
        cartaID.classList.add("carta-id");
        cartaID.textContent = limpiarID(carta.id);

        headerCarta.appendChild(nombreDiv);
        headerCarta.appendChild(cartaID);
        colorHeader(carta.color.es,headerCarta);

        // === BODY ===
        const cartaBody = document.createElement("div");
        cartaBody.classList.add("carta-body");

        const img = document.createElement("img");
        img.src = carta.image;
        img.alt = carta.name;

        const indiceReal = (paginaActual - 1) * cartasPorPagina + index;
        img.addEventListener("click", () => {
            indiceActual = indiceReal;
            mostrarCarta(indiceActual);
        });

        cartaBody.appendChild(img);

        // Ensamblar carta
        cartaHTML.appendChild(headerCarta);
        cartaHTML.appendChild(cartaBody);

        contenedor.appendChild(cartaHTML);
    });
}
// Función que actualiza todo el contenido del modal según el idiomaActual
function actualizarTextoModal() {
    if (!cartaModal) return;

    // Header principal: ID | Rareza | Personaje
    const infoHeader = document.getElementById("Info");
    infoHeader.innerHTML = `${limpiarID(cartaModal.id)} | ${cambiarRarezaLetra(cartaModal.rarity[idiomaActual])} | ${cartaModal.type[idiomaActual]}`;

    // Color header
    const modalHeader = document.querySelector(".modal-header");
    colorHeader(cartaModal.color.es, modalHeader);

    // Atributos
    const atributosDiv = document.getElementById("atributos-carta");
    atributosDiv.innerHTML = "";

    const atributos = [
        { key: "name", label: { es: "", en: "" } },
        { key: "rarity", label: { es: "Rareza", en: "Rarity" } },
        { key: "life", label: { es: "Vidas", en: "Life" } },
        { key: "cost", label: { es: "Costo", en: "Cost" } },
        { key: "counter", label: { es: "Contraataque", en: "Counter" } },
        { key: "power", label: { es: "Poder", en: "Power" } },
        { key: "color", label: { es: "Color", en: "Color" } },
        { key: "attribute", label: { es: "Atributo", en: "Attribute" } },
        { key: "block_icon", label: { es: "Icono de bloque", en: "Block Icon" } },
        { key: "alliance", label: { es: "Alianza", en: "Alliance" } },
        { key: "effect", label: { es: "Efecto", en: "Effect" } },
        { key: "description", label: { es: "", en: "" } },
        { key: "trigger", label: { es: "Disparador", en: "Trigger" } },
    ];

    atributos.forEach(attr => {
        let valor = cartaModal[attr.key];
        let label = attr.label[idiomaActual];

        // Si es objeto con traducciones, tomar el del idioma
        if (typeof valor === "object" && valor !== null) {
            valor = valor[idiomaActual] || "";
        }
        // Filtrar valores no válidos
        if (valor === null || valor === undefined || valor === "") {
            return;
        }
        // Caso especial atributo con icono
        if (attr.key === "attribute") {
            atributosDiv.innerHTML += `<div><b>${label}:</b> <img src="${cartaModal.image_attribute}" class="atributo-icono"> ${valor}</div>`;
        } 
        else {
            atributosDiv.innerHTML += `<div><b>${label}${label ? ":" : ""}</b> ${valor}</div>`;
        }
    });
}

// Función para mostrar la carta en el modal
function mostrarCarta(indice) {
    const carta = cartasVisibles[indice];
    if (!carta) return;

    cartaModal = carta; // guardamos la carta actual
    document.getElementById("imagen-carta").src = carta.image;

    actualizarTextoModal(); // inicializa el contenido del modal
    modal.style.display = "flex";
}
//Funcion limpiar id
function limpiarID(id) {
    separarID = id.split("_")
    return separarID[0]
}

//funcion flechas del modal
function cambiarCartaDesdeModal(direccion) {
    indiceActual = (indiceActual + direccion + cartasVisibles.length)%cartasVisibles.length;
    mostrarCarta(indiceActual);
};

//funcion mostrar cartas paginadas
function mostrarCartasPaginadas() {
    contenedor.innerHTML = "";

    let inicio = (paginaActual - 1) * cartasPorPagina;
    let fin = inicio + cartasPorPagina;

    let cartasPagina = cartasVisibles.slice(inicio, fin);

    if (cartasPagina.length === 0) {
        msgSinResultado.style.display = "block";
        return;
    } 
    else {
        msgSinResultado.style.display = "none";
        renderizarCartas(cartasPagina);
        generarPaginacion();
    }
};

//funcion de renderizar cartas paginadas
function generarPaginacion() {
    const totalPaginas = Math.ceil(cartasVisibles.length / cartasPorPagina);
    const paginacionDiv = document.getElementById("paginacion");
    paginacionDiv.innerHTML = "";

    // Botón anterior
    const btnPrev = document.createElement("button");
    btnPrev.textContent = "◀";
    btnPrev.disabled = paginaActual === 1;
    btnPrev.onclick = () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarCartasPaginadas();
        }
    };
    paginacionDiv.appendChild(btnPrev);

    // Lógica para mostrar máximo 8 botones
    let inicio = Math.max(1, paginaActual - 4);
    let fin = Math.min(totalPaginas, inicio + 7);

    if (fin - inicio < 7) {
        inicio = Math.max(1, fin - 7);
    }

    for (let i = inicio; i <= fin; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaActual) btn.classList.add("activo");
        btn.onclick = () => {
            paginaActual = i;
            mostrarCartasPaginadas();
        };
        paginacionDiv.appendChild(btn);
    }

    // Botón siguiente
    const btnNext = document.createElement("button");
    btnNext.textContent = "▶";
    btnNext.disabled = paginaActual === totalPaginas;
    btnNext.onclick = () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarCartasPaginadas();
        }
    };
    paginacionDiv.appendChild(btnNext);
}

//funcion para generar los filtros en formato ul/li
function generarOpcionesFiltros(cartas) {
    const propiedades = {
        color: "Color",
        cost: "Costo",
        attribute: "Atributo",
        rarity: "Rareza",
        type: "Tipo",
        effect: "Efecto",
        alliance: "Alianza"
    };
    const filtrosContainer = document.getElementById("filtros-container");
    filtrosContainer.innerHTML = "";

    Object.keys(propiedades).forEach(prop => {
        const valores = new Set();

        cartas.forEach(carta => {
            if (carta[prop]) {
                const valor = carta[prop];

                if (typeof valor === "object" && valor !== null) {
                    // Solo tomamos el valor en español y que no sea null ni vacío
                    if (valor.es && valor.es !== "") {
                        if (valor.es.includes("/")) {
                            valor.es.split("/").forEach(v => valores.add(v.trim()));
                        } 
                        else {
                            valores.add(valor.es.trim());
                        }
                    }
                } 
                else if (valor !== null && valor !== "" && valor !== 0) {
                    valores.add(valor);
                }
            }
        });
        if (valores.size > 0) {
            // Crear contenedor del filtro
            const filtroDiv = document.createElement("div");
            filtroDiv.classList.add("filtro");

            // Cabecera del filtro
            const header = document.createElement("div");
            header.classList.add("filtro-header");
            header.textContent = propiedades[prop] + ": Todos ▼";
            header.dataset.value = "";
            header.dataset.prop = prop;

            // Lista de opciones
            const lista = document.createElement("ul");
            lista.classList.add("filtro-opciones");
            lista.style.display = "none";
            

            // Opción "Todos"
            const opcionTodos = document.createElement("li");
            opcionTodos.dataset.value = "";
            opcionTodos.textContent = "Todos";
            lista.appendChild(opcionTodos);

            [...valores].sort().forEach(valor => {
                if (valor !== "0" && valor !== 0 && valor !== "" && valor !== null) {
                    const li = document.createElement("li");                   
                    li.dataset.value = valor;
                    li.textContent = valor;
                    li.title = valor;
                    lista.appendChild(li);
                }
            });

            filtroDiv.appendChild(header);
            filtroDiv.appendChild(lista);
            filtrosContainer.appendChild(filtroDiv);

            // Mostrar lista al hacer hover y poner "Seleccionando..."
            filtroDiv.addEventListener("mouseenter", () => {
                document.querySelectorAll(".filtro-opciones").forEach(l => l.style.display = "none");
                lista.style.display = "block";
                header.textContent = "Seleccionando...";
            });

            // Ocultar al salir sin elegir nada (restaurar valor actual)
            filtroDiv.addEventListener("mouseleave", () => {
                lista.style.display = "none";
                const val = header.dataset.value || "";
                header.textContent = propiedades[prop] + ": " + (val === "" ? "Todos ▼" : val);
            });

            // Evento al seleccionar
            lista.querySelectorAll("li").forEach(li => {
                li.addEventListener("click", () => {
                    header.dataset.value = li.dataset.value; // guardar valor
                    header.textContent = propiedades[prop] + ": " + (li.dataset.value === "" ? "Todos" : li.textContent) + " ▼";
                    lista.style.display = "none";
                    aplicarFiltros(); // aplicar inmediatamente
                    actualizarFiltrosActivos();
                });
            });
        }
    });
}

//funcion filtrar cartas
function aplicarFiltros() {
    const filtros = {};
    document.querySelectorAll(".filtro-header").forEach(header => {
        const prop = header.dataset.prop; 
        const val = header.dataset.value || "";
        filtros[prop] = val;
    });

    const buscador = inputBuscar.value.toLowerCase();

    cartasVisibles = cartasData.filter(carta => {
        const pasaFiltros = Object.keys(filtros).every(filtro => {
            if (filtros[filtro] === "") return true;

            const valorCarta = carta[filtro];

            if (typeof valorCarta === "string" && valorCarta.includes("/")) {
                return valorCarta.split("/").map(v => v.trim()).includes(filtros[filtro]);
            } 
            else if (Array.isArray(valorCarta)) {
                return valorCarta.map(v => v.trim()).includes(filtros[filtro]);
            } 
            else if (typeof valorCarta === "object" && valorCarta !== null && valorCarta.es) {
                const valorEs = valorCarta.es.trim().toLowerCase();
                const filtroEs = filtros[filtro].trim().toLowerCase();

                if (valorEs.includes("/")) {
                    return valorEs.split("/").map(v => v.trim().toLowerCase()).includes(filtroEs);
                }

                return valorEs === filtroEs;
            } 
            else {
                return String(valorCarta) === filtros[filtro];
            }
        });
        if (!pasaFiltros) return false;

        if (buscador === "") return true;
        return Object.values(carta).some(val =>
            String(val).toLowerCase().includes(buscador)
        );
    });
    paginaActual = 1;
    mostrarCartasPaginadas();
}

//funcion para los filtros
function activarHoverFiltros() {
    document.querySelectorAll(".filtro").forEach(filtro => {
        const opciones = filtro.querySelector(".filtro-opciones");

        if (!opciones) return; // seguridad

        filtro.addEventListener("mouseenter", () => {
            opciones.style.display = "block";
        });

        filtro.addEventListener("mouseleave", () => {
            opciones.style.display = "none";
        });
    });
}
//funcion de filtros activos
function actualizarFiltrosActivos() {

    // Limpia todo excepto el botón "limpiar"
    filtrosActivos.querySelectorAll(".filtro-activo").forEach(el => el.remove());

    // Recorre los headers y agrega los que tengan valor distinto de "Todos"
    document.querySelectorAll(".filtro-header").forEach(header => {
        const valor = header.dataset.value;
        const nombre = header.textContent.split(":")[0];

        if (valor && valor !== "") {
            const filtroEl = document.createElement("div");
            filtroEl.classList.add("filtro-activo");

            const span = document.createElement("span");
            span.textContent = nombre + ": " + valor;

            const btn = document.createElement("button");
            btn.textContent = "✕";
            btn.addEventListener("click", () => {
                header.dataset.value = "";
                header.textContent = nombre + ": Todos ▼";
                aplicarFiltros();
                actualizarFiltrosActivos();
            });

            filtroEl.appendChild(span);
            filtroEl.appendChild(btn);

            filtrosActivos.insertBefore(filtroEl, limpiarBtn);
        }
    });
}

//funcion para cambiar rareza a solo letra
function cambiarRarezaLetra(rareza) {
    const letras = rareza.split("");
    if (letras[0] == "P" || letras[0] == "U") {
        return "UC"
    }
    if (letras[1] == "ú") {
        return "SR"
    }
    else {
        return letras[0]
    }
}

// función para el color del header
function colorHeader(color,elemento) {

    if (!elemento) return

    // si hay dos colores separados por "/"
    const colores = color.toLowerCase().split("/");
    
    if (colores.length === 2) {
        const colorHex1 = coloresCarta[colores[0]] || "#d1d5db";
        const colorHex2 = coloresCarta[colores[1]] || "#d1d5db";
        const middle = mixWith(colorHex1, colorHex2, 0.5); 
        elemento.style.background = `linear-gradient(90deg, 
            ${colorHex1} 0%, 
            ${middle} 50%,
            ${colorHex2} 100%)`;
    } 
    // un solo color → degradado
    else {
        const colorHex = coloresCarta[colores[0]] || "#d1d5db";
        elemento.style.background = `linear-gradient(90deg, 
            ${shadeColor(colorHex, -30)} 0%, 
            ${colorHex} 50%, 
            ${shadeColor(colorHex, 30)} 100%)`;
    }

    // texto y bordes siempre en blanco
    elemento.style.color = "white";
    const nombreHeader = elemento.querySelector(".carta-nombre");
    if (nombreHeader) {
        nombreHeader.style.borderBottom = `1px solid white`;
    }
}
//degradado de color
function shadeColor(color, percent) {
    const num = parseInt(color.slice(1), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1).toUpperCase();
}
function lightenColor(color, percent) {
    return shadeColor(color, percent); // lo mismo, solo que semanticamente "lighten"
}
function mixWith(color1, color2, t) { // t 0..1
  const c1 = parseInt(color1.slice(1),16);
  const c2 = parseInt(color2.slice(1),16);
  const r = Math.round((c1>>16)*(1-t) + (c2>>16)*t);
  const g = Math.round((c1>>8 & 0xFF)*(1-t) + (c2>>8 & 0xFF)*t);
  const b = Math.round((c1 & 0xFF)*(1-t) + (c2 & 0xFF)*t);
  return "#" + (1<<24 | r<<16 | g<<8 | b).toString(16).slice(1).toUpperCase();
}


//VARIABLES//
// 1. Seleccionamos el contenedor donde van las cartas
const contenedor = document.getElementById("contenedor-cartas");

// Elementos del modal
const modal = document.getElementById("modal-carta");
const modalNombre = document.getElementById("nombre-carta");
const modalImagen = document.getElementById("imagen-carta");
const cerrarModal = document.getElementById("cerrar-modal");
let cartasVisibles = [];

//variables buscador
const inputBuscar = document.getElementById("buscador");
const msgSinResultado = document.getElementById("msg-sin-resultados");

//elementos paginacion
let cartasPorFila = 5;   
let filasPorPagina = 6; 
let cartasPorPagina = cartasPorFila * filasPorPagina;
let paginaActual = 1;

//elementos del filtro
const btnFiltros = document.getElementById("btn-filtros");
const filtrosContainer = document.getElementById("filtros-container");
const filtrosActivos = document.getElementById("filtros-activos");
const listaFiltros = document.getElementById("lista-filtros");
const limpiarBtn = document.getElementById("limpiar-filtros");

// valores para cambio idioma
let idiomaActual = "es";
let cartaModal = null;

//colores del header
const coloresCarta = {
  "rojo": "#d32f2f",
  "azul": "#1976d2",
  "verde": "#388e3c",
  "amarillo": "#fbc02d",
  "morado": "#7b1fa2",
  "negro": "#212121"
};


// COMIENZO DEL CODIGO
fetch("public/data/cartas_OP01.json")
    .then(respuesta => respuesta.json())
    .then(cartas => {
        cartasData = cartas;
        cartasVisibles = cartas;
        // 3. Recorremos cada carta y creamos su HTML
        generarOpcionesFiltros(cartasData);
        activarHoverFiltros();
        mostrarCartasPaginadas(cartasData);
    })
    .catch(err => console.error("Error cargando cartas:", err));

//cerrar modal
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Cerrar modal con la cruz
cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Cambiar idioma al presionar el botón
document.getElementById("btn-idioma").addEventListener("click", () => {
    idiomaActual = idiomaActual === "es" ? "en" : "es";
    document.getElementById("btn-idioma").textContent = idiomaActual === "es" ? "Español" : "English";
    actualizarTextoModal();
});

//buscador
inputBuscar.addEventListener("input", () => {
    aplicarFiltros();
});

//boton del filtro
btnFiltros.addEventListener("click", () => {
    if (filtrosContainer.style.display === "none" || filtrosContainer.style.display === "") {
        filtrosContainer.style.display = "grid";
        filtrosActivos.style.display = "flex"; // solo el panel de filtros
    }
    else if (filtrosActivos.querySelectorAll(".filtro-activo").length > 0) {
        filtrosContainer.style.display = "none";
        filtrosActivos.style.display = "flex";
    }
    else {
        filtrosContainer.style.display = "none";
        filtrosActivos.style.display = "none"; // ocultar panel de filtros
        // NO tocamos filtrosActivos aquí, para que siga visible si hay filtros activos
    }
});

// Botón limpiar todos
document.getElementById("limpiar-filtros").addEventListener("click", () => {
    document.querySelectorAll(".filtro-header").forEach(header => {
        const nombre = header.textContent.split(":")[0];
        header.dataset.value = "";
        header.textContent = nombre + ": Todos ▼";
    });
    aplicarFiltros();
    actualizarFiltrosActivos();
}); 






