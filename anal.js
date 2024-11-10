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

  // Análisis de accesibilidad al transporte público por zona
  const nivelAccesibilidad = marginacionGeoJSON.features.map((feature) => {
    const gradoMarginacion = feature.properties.GM_2020;
    const poblacionTotal = feature.properties.POB_TOTAL;

    return {
      area: feature.properties.CVE_AGEB,
      gradoMarginacion,
      poblacionTotal,
    };
  });

  console.log('Nivel de accesibilidad por zona:', nivelAccesibilidad);
}

// Funciones adicionales para realizar cálculos de análisis
function calcularAccesibilidad(feature) {
  // Aquí podrías usar funciones de turf para calcular distancias y accesibilidad
  // por ejemplo, evaluar si las áreas marginadas tienen acceso cercano a
  // paradas de transporte público.
  return turf.distance(feature.geometry.coordinates, [/* coordenadas de referencia */]);
}
//pendiente
