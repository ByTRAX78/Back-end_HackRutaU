const fs = require('fs');
const csv = require('csv-parser');

// Leer los datos de las paradas desde el archivo CSV
const stopTimesData = [];
fs.createReadStream('./data/stop_times.csv')
  .pipe(csv())
  .on('data', (row) => {
    stopTimesData.push(row);
  })
  .on('end', () => {
    console.log('Datos de tiempos de parada cargados exitosamente.');
    analizarTiemposDeEspera();
  });

function analizarTiemposDeEspera() {
  const tiemposEspera = [];

  // Iterar sobre las filas para calcular los tiempos de espera entre paradas consecutivas
  for (let i = 1; i < stopTimesData.length; i++) {
    const paradaAnterior = stopTimesData[i - 1];
    const paradaActual = stopTimesData[i];

    if (paradaAnterior.trip_id === paradaActual.trip_id) {
      const tiempoAnterior = convertirATiempo(paradaAnterior.arrival_time);
      const tiempoActual = convertirATiempo(paradaActual.arrival_time);

      const tiempoEspera = tiempoActual - tiempoAnterior;
      tiemposEspera.push({

        stop_id: paradaActual.stop_id,
        tiempoEspera,
      });
    }
  }

  console.log('Tiempos de espera entre paradas:', tiemposEspera);
}

function convertirATiempo(hora) {
  const [horas, minutos, segundos] = hora.split(':').map(Number);
  return horas * 3600 + minutos * 60 + segundos;
}