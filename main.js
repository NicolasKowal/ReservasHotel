let habitaciones = [
	{ id: 1, cantidadpersonas: 4, individuales: 2, dobles: 1, precio: 400 },
	{ id: 2, cantidadpersonas: 3, individuales: 1, dobles: 1, precio: 350 },
	{ id: 3, cantidadpersonas: 4, individuales: 2, dobles: 1, precio: 400 },
	{ id: 4, cantidadpersonas: 3, individuales: 1, dobles: 1, precio: 350 },
	{ id: 5, cantidadpersonas: 4, individuales: 0, dobles: 2, precio: 700 },
	{ id: 6, cantidadpersonas: 5, individuales: 3, dobles: 1, precio: 500 },
	{ id: 7, cantidadpersonas: 5, individuales: 3, dobles: 1, precio: 500 },
	{ id: 8, cantidadpersonas: 2, individuales: 2, dobles: 0, precio: 250 },
	{ id: 9, cantidadpersonas: 2, individuales: 0, dobles: 1, precio: 250 },
	{ id: 10, cantidadpersonas: 1, individuales: 1, dobles: 0, precio: 200 },
	{ id: 11, cantidadpersonas: 5, individuales: 5, dobles: 0, precio: 700 },
];

let reservas = [];

class Reserva {
	constructor(id, fechaInicio, fechaFin) {
		this.id = id;
		this.fechaInicio = fechaInicio;
		this.fechaFin = fechaFin;
	}
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

function buscarReserva(array, habitacion, inicio, fin) {
	array.find((element) => {});
}

function condicionesDeBusqueda(fechaInicio, fechaFin, mayores, menores) {
	if (fechaInicio > fechaFin) {
		return 1;
	} else if (fechaInicio == 0 && fechaFin == 0) {
		return 2;
	} else if (fechaInicio < fechaFormateada) {
		return 3;
	} else if (mayores + menores <= 0) {
		return 4;
	} else if (mayores == 0) {
		return 5;
	} else {
		return 0;
	}
}

let buscarReservas = document.querySelector("#busqueda-reserva");
let confirmaReserva = document.querySelector("#confirma-reserva");
let btnBuscarReservas = document.querySelector("#btnBuscarReservas");
let aside = document.querySelector("#aside");
let fechaInicio = document.querySelector("#fecha-inicio");
fechaInicio.setAttribute("min", fechaFormateada);
let fechaFin = document.querySelector("#fecha-fin");
fechaFin.setAttribute("min", fechaFormateada);
let mayores = document.querySelector("#mayores");
let menores = document.querySelector("#menores");
let cambio = document.querySelector("#tipo-de-cambio");

function CompararFechas(fechaInicio, fechaFin) {
	let fI = fechaInicio;
	let fF = fechaFin;

	let dia1 = fI.slice(0, 4);
	let mes1 = fI.slice(5, 7);
	let año1 = fI.slice(8, 10);
	let dia2 = parseInt(fF.slice(0, 4));
	let mes2 = parseInt(fF.slice(5, 7))-1;
	let año2 = parseInt(fF.slice(8, 10));


	console.log(dia1);
	console.log(mes1);
	console.log(año1);
	console.log(dia2);
	console.log(mes2);
	console.log(año2);

	let fecha1 = new Date(año1, mes1, dia1);
	let fecha2 = new Date(año2, mes2, dia2);

	console.log(fecha1);
	console.log(fecha2);
}

btnBuscarReservas.addEventListener("click", () => {
	CompararFechas(fechaInicio.value, fechaFin.value);
	aside.innerHTML = "";
	let retornoBusqueda = condicionesDeBusqueda(
		fechaInicio.value,
		fechaFin.value,
		parseInt(mayores.value),
		parseInt(menores.value)
	);
	let habitacionesFiltradas = habitaciones.filter(
		(element) =>
			element.cantidadpersonas ===
			parseInt(mayores.value) + parseInt(menores.value)
	);
	habitacionesFiltradas.forEach((element) => {
		let precioAMostrar;
		switch (cambio.value) {
			case "ARS":
				precioAMostrar = element.precio * valorDolar;
				break;
			case "USD":
				precioAMostrar = element.precio;
				break;
			default:
				break;
		}
		let habitacion = document.createElement("div");
		habitacion.innerHTML = `
			<div class="border rounded-3 p-2 d-flex flex-column justify-content-center align-items-center">
				<h3 class="h-40 w-100 text-center">Habitacion Nº${element.id}</h3>
				<p class="h-20 w-90 text-center" >Cantidad de personas: ${element.cantidadpersonas}</p>
				<p class="h-20 w-75 text-center" >Camas dobles: ${element.dobles}<br> camas individuales: ${element.individuales}</p>
				<p class="h-20 w-75 text-center" >$ ${precioAMostrar} ${cambio.value}.</p>
				<button class="h-20 w-50 rounded-3" id="btnReservar">Reservar</button>
			</div>
			`;
		aside.appendChild(habitacion);
		let btnReservar = habitacion.querySelector("#btnReservar");
		btnReservar.addEventListener("click", () => {
			aside.innerHTML = "";
			buscarReservas.style.display = "none";
			confirmaReserva.style.display = "flex";
			//generarReserva(reservas, element.id, fechaInicio.value, fechaFin.value);
		});
	});
});
