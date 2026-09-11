const CLAVE_TAREAS = 'taskia_data';
const tareas = [];

const formularioTareas = document.querySelector('#task-form');
const entradaTarea = document.querySelector('#task-input');
const listaTareas = document.querySelector('#task-list');
const contadorTareasPendientes = document.querySelector('#pending-tasks-count');

function guardarTareas() {
	localStorage.setItem(CLAVE_TAREAS, JSON.stringify(tareas));
}

function cargarTareas() {
	const datosGuardados = localStorage.getItem(CLAVE_TAREAS);

	if (!datosGuardados) {
		return;
	}

	const tareasGuardadas = JSON.parse(datosGuardados);

	if (Array.isArray(tareasGuardadas)) {
		tareas.push(...tareasGuardadas);
	}
}

function agregarTarea() {
	const texto = entradaTarea.value.trim();

	if (!texto) {
		return false;
	}

	tareas.push({
		id: Date.now(),
		texto,
		completada: false
	});

	guardarTareas();
	renderizarTareas();
	return true;
}

function renderizarTareas() {
	listaTareas.replaceChildren();

	const fragmento = document.createDocumentFragment();

	tareas.forEach((tarea) => {
		const elementoTarea = document.createElement('li');
		const textoTarea = document.createElement('span');
		const botonEstado = document.createElement('button');
		const botonEliminar = document.createElement('button');

		elementoTarea.classList.toggle('completed', tarea.completada);
		textoTarea.textContent = tarea.texto;
		botonEstado.type = 'button';
		botonEstado.dataset.taskId = tarea.id;
		botonEstado.dataset.action = 'toggle';
		botonEstado.textContent = tarea.completada ? 'Marcar pendiente' : 'Completar';
		botonEliminar.type = 'button';
		botonEliminar.dataset.taskId = tarea.id;
		botonEliminar.dataset.action = 'delete';
		botonEliminar.textContent = 'Eliminar';

		elementoTarea.append(textoTarea, botonEstado, botonEliminar);
		fragmento.appendChild(elementoTarea);
	});

	listaTareas.appendChild(fragmento);
	actualizarContador();
}

function actualizarContador() {
	const tareasPendientes = tareas.filter((tarea) => !tarea.completada).length;
	contadorTareasPendientes.textContent = tareasPendientes;
}

function alternarTarea(id) {
	const tarea = tareas.find((elemento) => elemento.id === id);

	if (!tarea) {
		return;
	}

	tarea.completada = !tarea.completada;
	guardarTareas();
	renderizarTareas();
}

function eliminarTarea(id) {
	const indiceTarea = tareas.findIndex((tarea) => tarea.id === id);

	if (indiceTarea === -1) {
		return;
	}

	tareas.splice(indiceTarea, 1);
	guardarTareas();
	renderizarTareas();
}

listaTareas.addEventListener('click', (evento) => {
	const botonTarea = evento.target.closest('button[data-task-id]');

	if (!botonTarea) {
		return;
	}

	const id = Number(botonTarea.dataset.taskId);

	if (botonTarea.dataset.action === 'toggle') {
		alternarTarea(id);
	}

	if (botonTarea.dataset.action === 'delete') {
		eliminarTarea(id);
	}
});

cargarTareas();
renderizarTareas();

formularioTareas.addEventListener('submit', (evento) => {
	evento.preventDefault();

	if (agregarTarea()) {
		formularioTareas.reset();
		entradaTarea.focus();
	}
});
