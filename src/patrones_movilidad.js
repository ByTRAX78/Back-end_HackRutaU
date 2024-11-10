const fs = require('fs');
const csv = require('csv-parser');

async function obtenerPatronesMovilidad() {
  // Cargar datos geojson del censo y de marginación
  const censoGeoJSON = JSON.parse(fs.readFileSync('./data/censo-2020.geojson'));

  // Leer datos de ingresos y gastos de los hogares (ENIGH)
  const enighData = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream('./data/enigh.csv')
      .pipe(csv())
      .on('data', (row) => {
        enighData.push(row);
      })
      .on('end', () => {
        console.log('Datos de ENIGH cargados exitosamente.');
        resolve();
      })
      .on('error', (error) => reject(error));
  });

  // Analizar patrones de movilidad según los datos del censo y ENIGH
  const patronesMovilidad = censoGeoJSON.features.map((feature) => {
    const poblacionTotal = feature.properties.POBTOT ?? 0;
    const viviendasConAuto = feature.properties.VPH_AUTOM ?? 0;
    const viviendasConMoto = feature.properties.VPH_MOTO ?? 0;
    const viviendasConBici = feature.properties.VPH_BICI ?? 0;

    // Crear el resultado solo si todos los valores son válidos
    if (
      poblacionTotal !== null &&
      viviendasConAuto !== null &&
      viviendasConMoto !== null &&
      viviendasConBici !== null
    ) {
      return {
        area: feature.properties.CVE_AGEB,
        poblacionTotal,
        viviendasConAuto,
        viviendasConMoto,
        viviendasConBici,
      };
    }
    return null; // Retornar null si alguno de los valores es null
  }).filter(item => item !== null); // Filtrar los resultados nulos

  const jsonOutput = { patrones_movilidad: patronesMovilidad };
  return jsonOutput;
}

