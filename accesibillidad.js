const fs = require('fs');
const csv = require('csv-parser');
const turf = require('@turf/turf');

// Cargar datos geojson del censo y de marginación
const marginacionGeoJSON = JSON.parse(fs.readFileSync('./data/imu-2020.geojson'));

// Leer datos de ingresos y gastos de los hogares (ENIGH)
const enighData = [];
fs.createReadStream('./data/enigh.csv')
  .pipe(csv())
  .on('data', (row) => {
    enighData.push(row);
  })
  .on('end', () => {
    console.log('Datos de ENIGH cargados exitosamente.');
    analizarDatos();
  });

function analizarDatos() {
  const nivelAccesibilidad = [];
  const areasProcesadas = new Set();

  marginacionGeoJSON.features.forEach((feature) => {
    const gradoMarginacion = feature.properties.GM_2020;
    const poblacionTotal = feature.properties.POB_TOTAL;
    const areaCode = feature.properties.CVE_AGEB;

    // Verificar si el área ya fue procesada
    if (!areasProcesadas.has(areaCode)) {
      areasProcesadas.add(areaCode);

      nivelAccesibilidad.push({
        area: areaCode,
        gradoMarginacion,
        poblacionTotal,
      });
    }
  });

  // Guardar el resultado en un archivo JSON
  fs.writeFile('./data/resultado_accesibilidad.json', JSON.stringify(nivelAccesibilidad, null, 2), (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err);
    } else {
      console.log('Resultados de accesibilidad guardados en resultado_accesibilidad.json');
    }
  });
}

