let habitaciones = [
	{ id: 1, cantidadpersonas: 4, individuales: 2, dobles: 1, precio: 40 },
	{ id: 2, cantidadpersonas: 3, individuales: 1, dobles: 1, precio: 35 },
	{ id: 3, cantidadpersonas: 4, individuales: 2, dobles: 1, precio: 40 },
	{ id: 4, cantidadpersonas: 3, individuales: 1, dobles: 1, precio: 35 },
	{ id: 5, cantidadpersonas: 4, individuales: 0, dobles: 1, precio: 70 },
	{ id: 6, cantidadpersonas: 5, individuales: 3, dobles: 1, precio: 50 },
	{ id: 7, cantidadpersonas: 5, individuales: 3, dobles: 1, precio: 50 },
	{ id: 8, cantidadpersonas: 2, individuales: 2, dobles: 0, precio: 25 },
	{ id: 9, cantidadpersonas: 2, individuales: 0, dobles: 1, precio: 25 },
	{ id: 10, cantidadpersonas: 1, individuales: 1, dobles: 0, precio: 20 },
	{ id: 11, cantidadpersonas: 5, individuales: 5, dobles: 0, precio: 70 },
];

class Reserva {
	constructor(
		id,
		fechaInicio,
		fechaFin,
		nombre,
		apellido,
		mail,
		telefono,
		fechaDeNacimiento,
		total,
		cambio
	) {
		this.id = id;
		this.fechaInicio = fechaInicio;
		this.fechaFin = fechaFin;
		this.nombre = nombre;
		this.apellido = apellido;
		this.mail = mail;
		this.total = total;
		this.fechaDeNacimiento = fechaDeNacimiento;
		this.telefono = telefono;
		this.cambio = cambio;
	}
}

let reservas = [];
const GuardarStorage = (array, nombre) => {
	const listaJSON = JSON.stringify(array);
	localStorage.setItem(nombre, listaJSON);
};
const CantidadJSON = localStorage.getItem("reservas");
if (CantidadJSON) {
	const Cantidad = JSON.parse(CantidadJSON);
	reservas = Cantidad;
} else {
	reservas = [];
}

function generarReserva(array, habitacion, inicio, fin) {
	let nuevaReserva = new Reserva(habitacion, inicio, fin);
	array.push(nuevaReserva);
	console.log(nuevaReserva);
	console.log(array);
}

let valorDolar;
fetch("https://dolarapi.com/v1/dolares/blue")
	.then((response) => response.json())
	.then((data) => (valorDolar = data.venta));

const fechaActual = new Date();
const año = fechaActual.getFullYear();
const mes = String(fechaActual.getMonth() + 1).padStart(2, "0");
const dia = String(fechaActual.getDate()).padStart(2, "0");
const fechaFormateada = `${año}-${mes}-${dia}`;

const AgregarIva = (numero) => {
	let valor = parseInt(numero);
	return valor + (21 * valor) / 100;
};

function CompararFechas(fechaInicio, fechaFin) {
	const fecha1 = new Date(fechaInicio);
	const fecha2 = new Date(fechaFin);

	const diferenciaMilisegundos = fecha2 - fecha1;
	const milisegundosPorDia = 1000 * 60 * 60 * 24;
	return Math.floor(diferenciaMilisegundos / milisegundosPorDia) + 1;
}

function condicionesDeBusqueda(fechaInicio, fechaFin, mayores, menores) {
	if (fechaInicio > fechaFin) {
		return "la fecha de finalizacion esta antes que la de inicio";
	} else if (fechaInicio == 0 && fechaFin == 0) {
		return "fecha no seleccionada";
	} else if (fechaInicio < fechaFormateada) {
		return "fecha anterior al dia de hoy";
	} else if (mayores + menores <= 0) {
		return "seleccionar cantidad de personas";
	} else if (mayores == 0) {
		return "tiene que seleccionar un mayor de edad";
	} else {
		return "";
	}
}

let btnSiguiente = document.querySelector("#siguiente");
let btnAtras = document.querySelector("#atras");
let buscarReservas = document.querySelector("#busqueda-reserva");
let confirmaReserva = document.querySelector("#confirma-reserva");
let btnBuscarReservas = document.querySelector("#btnBuscarReservas");
btnBuscarReservas.textContent = "Buscar";
let aside = document.querySelector("#aside");
let fechaInicio = document.querySelector("#fecha-inicio");
fechaInicio.setAttribute("min", fechaFormateada);
let fechaFin = document.querySelector("#fecha-fin");
fechaFin.setAttribute("min", fechaFormateada);
let mayores = document.querySelector("#mayores");
let menores = document.querySelector("#menores");
let cambio = document.querySelector("#tipo-de-cambio");
let fecNac = document.querySelector("#fechaDeNacimiento");
fecNac.setAttribute("max", fechaFormateada);
let emailReserva = document.querySelector("#emailReserva");
let nombreReserva = document.querySelector("#nombreReserva");
let apellidoReserva = document.querySelector("#apellidoReserva");
let contactoReserva = document.querySelector("#contactoReserva");
let fechaDeNacimiento = document.querySelector("#fechaDeNacimiento");
let erroresDeBusqueda = document.querySelector("#erroresDeBusqueda");

btnBuscarReservas.addEventListener("click", () => {
	let cantidadDeDias = CompararFechas(fechaInicio.value, fechaFin.value);
	aside.innerHTML = "";
	let retornoBusqueda = condicionesDeBusqueda(
		fechaInicio.value,
		fechaFin.value,
		parseInt(mayores.value),
		parseInt(menores.value)
	);
	erroresDeBusqueda.textContent = retornoBusqueda;

	if (erroresDeBusqueda.textContent == "") {
		console.log(reservas);
		/*----------------*/

		let habitacionesFiltradas = habitaciones.filter(
			(element) =>
				element.cantidadpersonas ===
				parseInt(mayores.value) + parseInt(menores.value)
		);
		let reservasFiltrada = reservas.filter((element) => {
			console.log(fechaInicio.value);
			console.log(element.fechaInicio);
			if (
				!(
					element.fechaInicio <= fechaFin.value &&
					element.fechaFin >= fechaInicio.value
				)
			) {
				return element;
			}
		});
		console.log(reservasFiltrada);

		habitacionesFiltradas.forEach((element) => {
			let precioAMostrar;
			let precioPorDia;

			switch (cambio.value) {
				case "ARS":
					precioPorDia = element.precio * valorDolar;
					precioPorDia = AgregarIva(precioPorDia);
					precioAMostrar = precioPorDia * cantidadDeDias;
					break;
				case "USD":
					precioPorDia = AgregarIva(element.precio);
					precioAMostrar = precioPorDia * cantidadDeDias;
					break;
				default:
					break;
			}

			let habitacion = document.createElement("div");
			habitacion.innerHTML = `
                <div class="border rounded-3 p-2 d-flex flex-column justify-content-center align-items-center">
                    <h3 class="h-40 w-100 text-center">Habitacion Nº${
											element.id
										}</h3>
                    <p class="h-20 w-90 text-center">Cantidad de personas: ${
											element.cantidadpersonas
										}</p>
                    <p class="h-20 w-75 text-center">Camas dobles: ${
											element.dobles
										}<br> camas individuales: ${element.individuales}</p>
                    <p class="h-20 w-80 text-center">Precio por noche: $${precioPorDia.toFixed(
											2
										)} ${cambio.value}.</p>
                    <p class="h-20 w-80 text-center">Precio por ${cantidadDeDias} noches: $${precioAMostrar.toFixed(
				2
			)} ${cambio.value}.</p>
                    <button class="h-25 w-50 rounded-3" id="btnReservar${
											element.id
										}">Reservar</button>
                </div>`;

			aside.appendChild(habitacion);

			document
				.querySelector(`#btnReservar${element.id}`)
				.addEventListener("click", () => {
					aside.innerHTML = "";
					buscarReservas.style.display = "none";
					confirmaReserva.style.display = "flex";

					let reservaCantidadDePersonas =
						parseInt(mayores.value) + parseInt(menores.value);

					btnSiguiente.onclick = () => {
						buscarReservas.style.display = "none";
						confirmaReserva.style.display = "none";
						aside.innerHTML = `
                        <div>
                            <p>Nombre<br>${nombreReserva.value} ${
							apellidoReserva.value
						}</p>
                            <p>Teléfono<br>${contactoReserva.value}</p>
                            <p>Email<br>${emailReserva.value}</p>
                            <p>Check-in: ${fechaInicio.value}</p>
                            <p>Check-out: ${fechaFin.value}</p>
                            <p>Cantidad de personas: ${reservaCantidadDePersonas}</p>
                            <p>Total a pagar: $${precioAMostrar.toFixed(2)} ${
							cambio.value
						}</p>
                            <button type="button" id="finalizarReserva">Finalizar</button>
                            <buttontype="button" id="volverAreserva">Atrás</buttontype=>
						</div>`;
						document
							.querySelector("#finalizarReserva")
							.addEventListener("click", () => {
								let nuevaReserva = new Reserva(
									element.id,
									fechaInicio.value,
									fechaFin.value,
									nombreReserva.value,
									apellidoReserva.value,
									emailReserva.value,
									contactoReserva.value,
									fechaDeNacimiento.value,
									precioAMostrar,
									cambio.value
								);
								reservas.push(nuevaReserva);
								GuardarStorage(reservas, "reservas");
								buscarReservas.style.display = "flex";
								aside.innerHTML = "";
								fechaInicio.value = "";
								fechaFin.value = "";
								mayores.value = 0;
								menores.value = 0;
								cambio.value = "ARS";
								emailReserva.value = "";
								nombreReserva.value = "";
								apellidoReserva.value = "";
								fechaDeNacimiento.value = "";
								contactoReserva.value = "";
							});

						document
							.querySelector("#volverAreserva")
							.addEventListener("click", () => {
								confirmaReserva.style.display = "flex";
								aside.innerHTML = "";
							});
					};
				});
		});
	}
});

btnAtras.addEventListener("click", () => {
	buscarReservas.style.display = "flex";
	confirmaReserva.style.display = "none";
});
