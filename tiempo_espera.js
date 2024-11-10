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
  const tiemposPorStopId = {};

  // Iterar sobre las filas para calcular los tiempos de espera entre paradas consecutivas
  for (let i = 1; i < stopTimesData.length; i++) {
    const paradaAnterior = stopTimesData[i - 1];
    const paradaActual = stopTimesData[i];

    if (paradaAnterior.trip_id === paradaActual.trip_id) {
      const tiempoAnterior = convertirATiempo(paradaAnterior.arrival_time);
      const tiempoActual = convertirATiempo(paradaActual.arrival_time);

      const tiempoEspera = (tiempoActual - tiempoAnterior) / 60; // Convertir a minutos
      if (tiempoEspera > 0) {
        tiemposEspera.push({
          stop_id: paradaActual.stop_id,
          tiempoEspera,
        });

        // Calcular la diferencia entre horas registradas para el mismo stop_id
        if (!tiemposPorStopId[paradaActual.stop_id]) {
          tiemposPorStopId[paradaActual.stop_id] = [];
        }
        tiemposPorStopId[paradaActual.stop_id].push(tiempoEspera);
      }
    }
  }

  // Calcular el promedio de tiempos de espera entre registros para el mismo stop_id
  const tiemposEsperaConPromedio = Object.keys(tiemposPorStopId).map((stop_id) => {
    const tiempos = tiemposPorStopId[stop_id];
    const tiempoEspera = tiempos[0];
    const promedioEsperaEntreParadas = tiempos.length > 1 ? (tiempos.reduce((acc, curr) => acc + curr, 0) / tiempos.length) : 0;

    return {
      stop_id,
      tiempoEspera,
      tiempoEsperaEntreParadas: tiempos.length > 1 ? promedioEsperaEntreParadas : 0,
    };
  });

  console.log('Tiempos de espera entre paradas con promedio:', tiemposEsperaConPromedio);
}

function convertirATiempo(hora) {
  const [horas, minutos, segundos] = hora.split(':').map(Number);
  return horas * 3600 + minutos * 60 + segundos;
}
