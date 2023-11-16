function obtenerHora() {
  const ahora = new Date();
  const opciones = { timeZone: 'America/Argentina/Mendoza' };
  return ahora.toLocaleTimeString('es-AR', opciones);
}

function obtenerFecha() {
  const ahora = new Date();
  return ahora.toISOString().slice(0, 10);
}

function mostrarHora() {
  const horaActual = obtenerHora();
  document.getElementById('time').textContent = `Hora actual en Mendoza: ${horaActual}`;
}

function calcularHorasTrabajadas(horaEntrada, horaSalida) {
  const horaInicio = new Date(`01/01/2000 ${horaEntrada}`);
  const horaFinal = new Date(`01/01/2000 ${horaSalida}`);
  
  // Calcular la diferencia en milisegundos
  let diferencia = horaFinal - horaInicio;

  // Convertir la diferencia de milisegundos a horas
  let horasTrabajadas = diferencia / 1000 / 60 / 60;

  // Redondear a dos decimales
  horasTrabajadas = Math.round((horasTrabajadas + Number.EPSILON) * 100) / 100;

  return horasTrabajadas;
}

function eliminarHora(fila) {
  fila.remove();
  // Aquí podrías implementar la lógica para eliminarlo de la base de datos o almacenamiento permanente.
}

function editarHora(fila) {
  const horaSalidaCell = fila.cells[2];
  const horasTrabajadasCell = fila.cells[3];
  const horaActual = obtenerHora();
  const horaSalidaActual = horaSalidaCell.textContent;
  
  const nuevaHora = prompt('Ingrese la nueva hora de salida en formato HH:MM', horaSalidaActual);
  if (nuevaHora) {
    const [nuevaHoraHH, nuevaHoraMM] = nuevaHora.split(':');
    if (!isNaN(nuevaHoraHH) && !isNaN(nuevaHoraMM) && nuevaHoraHH >= 0 && nuevaHoraHH <= 23 && nuevaHoraMM >= 0 && nuevaHoraMM <= 59) {
      horaSalidaCell.textContent = `${nuevaHoraHH.padStart(2, '0')}:${nuevaHoraMM.padStart(2, '0')}`;
      const horaEntrada = fila.cells[1].textContent;
      const horasTrabajadas = calcularHorasTrabajadas(horaEntrada, `${nuevaHoraHH.padStart(2, '0')}:${nuevaHoraMM.padStart(2, '0')}`);
      horasTrabajadasCell.textContent = `${horasTrabajadas} horas`;
      // Aquí podrías implementar la lógica para actualizar la hora de salida y las horas trabajadas en la base de datos o almacenamiento permanente.
    } else {
      alert('Formato de hora inválido. Use HH:MM (24 horas)');
    }
  }
}

function editarFecha(fila) {
  const fechaCell = fila.cells[0];
  const fechaActual = obtenerFecha();
  
  const nuevaFecha = prompt('Ingrese la nueva fecha en formato AAAA-MM-DD', fechaActual);
  if (nuevaFecha) {
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (fechaRegex.test(nuevaFecha)) {
      fechaCell.textContent = nuevaFecha;
      // Aquí podrías implementar la lógica para actualizar la fecha en la base de datos o almacenamiento permanente.
    } else {
      alert('Formato de fecha inválido. Use AAAA-MM-DD');
    }
  }
}

function registrarHora() {
  const horaEntrada = '08:00:00'; // Hora de entrada a las 8:00 AM
  const horaActual = obtenerHora();
  const fechaActual = obtenerFecha();

  // Verificar si es lunes a sábado y si es después de la hora de entrada
  const diaSemana = new Date().getDay();
  if (diaSemana >= 1 && diaSemana <= 6 && horaActual >= horaEntrada) {
    // Simplemente para demostración, puedes almacenar esta información en una base de datos o similar.
    const registroTabla = document.getElementById('registroTabla');
    const newRow = registroTabla.insertRow(-1);
    const dateCell = newRow.insertCell(0);
    const entradaCell = newRow.insertCell(1);
    const salidaCell = newRow.insertCell(2);
    const horasTrabajadasCell = newRow.insertCell(3);
    const editarFechaCell = newRow.insertCell(4);
    const editarCell = newRow.insertCell(5);
    const eliminarCell = newRow.insertCell(6);

    dateCell.textContent = fechaActual;
    entradaCell.textContent = horaEntrada;
    salidaCell.textContent = horaActual;

    const horasTrabajadas = calcularHorasTrabajadas(horaEntrada, horaActual);
    horasTrabajadasCell.textContent = `${horasTrabajadas} horas`;

    const editarFechaBtn = document.createElement('button');
    editarFechaBtn.textContent = 'Editar Fecha';
    editarFechaBtn.classList.add('waves-effect', 'waves-light', 'btn', 'blue');
    editarFechaBtn.addEventListener('click', function() {
      editarFecha(newRow);
    });
    editarFechaCell.appendChild(editarFechaBtn);

    const editarBtn = document.createElement('button');
    editarBtn.textContent = 'Editar';
    editarBtn.classList.add('waves-effect', 'waves-light', 'btn', 'orange');
    editarBtn.addEventListener('click', function() {
      editarHora(newRow);
    });
    editarCell.appendChild(editarBtn);

    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.classList.add('waves-effect', 'waves-light', 'btn', 'red');
    eliminarBtn.addEventListener('click', function() {
      eliminarHora(newRow);
    });
    eliminarCell.appendChild(eliminarBtn);

    // Puedes hacer más acciones aquí, como enviar los datos a un servidor o guardarlos localmente.
    // Solo se añade una fila en la tabla para representar el registro.
  } else {
    alert('No es hora de entrada o no es un día laboral.');
  }
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
}

// Mostrar hora actual al cargar la página
mostrarHora();

// Actualizar hora cada segundo
setInterval(mostrarHora, 1000);

document.getElementById('registroTabla').addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
    const filaSeleccionada = event.target.parentNode.parentNode;
    if (event.target.textContent === 'Eliminar') {
      eliminarHora(filaSeleccionada);
    } else if (event.target.textContent === 'Editar') {
      editarHora(filaSeleccionada);
    } else if (event.target.textContent === 'Editar Fecha') {
      editarFecha(filaSeleccionada);
    }
  }
});
