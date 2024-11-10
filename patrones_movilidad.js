const fs = require('fs');
const csv = require('csv-parser');
const turf = require('@turf/turf');

// Cargar datos geojson del censo y de marginación
const censoGeoJSON = JSON.parse(fs.readFileSync('./data/censo-2020.geojson'));

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
  // Analizar patrones de movilidad según los datos del censo y ENIGH
  const patronesMovilidad = censoGeoJSON.features.map((feature) => {
    const poblacionTotal = feature.properties.POBTOT;
    const viviendasConAuto = feature.properties.VPH_AUTOM;
    const viviendasConMoto = feature.properties.VPH_MOTO;
    const viviendasConBici = feature.properties.VPH_BICI;

    return {
      area: feature.properties.CVE_AGEB,
      poblacionTotal,
      viviendasConAuto,
      viviendasConMoto,
      viviendasConBici,
    };
  });

  console.log('Patrones de movilidad por área:', patronesMovilidad);
}