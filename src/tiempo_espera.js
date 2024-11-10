const fs = require('fs');
const csv = require('csv-parser');

async function obtenerTiemposDeEspera() {
  // Leer los datos de las paradas desde el archivo CSV
  const stopTimesData = [];

  // Función para cargar datos desde el CSV
  await new Promise((resolve, reject) => {
    fs.createReadStream('./data/stop_times.csv')
      .pipe(csv())
      .on('data', (row) => {
        stopTimesData.push(row);
      })
      .on('end', () => {
        console.log('Datos de tiempos de parada cargados exitosamente.');
        resolve();
      })
      .on('error', (error) => reject(error));
  });

  // Analizar los tiempos de espera
  const tiemposEspera = [];

  // Iterar sobre las filas para calcular los tiempos de espera entre paradas consecutivas
  for (let i = 1; i < stopTimesData.length; i++) {
    const paradaAnterior = stopTimesData[i - 1];
    const paradaActual = stopTimesData[i];

    if (paradaAnterior.trip_id === paradaActual.trip_id) {
      const tiempoAnterior = convertirATiempo(paradaAnterior.arrival_time);
      const tiempoActual = convertirATiempo(paradaActual.arrival_time);

      // Validar que ambos tiempos sean válidos (no null)
      if (tiempoAnterior !== null && tiempoActual !== null) {
        const tiempoEspera = tiempoActual - tiempoAnterior;

        // Validar que los campos necesarios no sean null antes de añadir al array
        if (paradaActual.stop_id !== null && tiempoEspera !== null) {
          tiemposEspera.push({
            stop_id: paradaActual.stop_id,
            tiempoEspera,
          });
        }
      }
    }
  }

  return { tiempos_espera: tiemposEspera };
}

// Función auxiliar para convertir el tiempo en segundos
function convertirATiempo(hora) {
  if (!hora) return null; // Validar si la hora es null o undefined

  const [horas, minutos, segundos] = hora.split(':').map(Number);
  return horas * 3600 + minutos * 60 + segundos;
}


