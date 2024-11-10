const fs = require('fs');
const csv = require('csv-parser');

module.exports = async () => {
  // Cargar los archivos geojson
  const aforoData = JSON.parse(fs.readFileSync('./src/files/aforo.geojson', 'utf8'));
  const censoData = JSON.parse(fs.readFileSync('./src/files/censo-2020.geojson', 'utf8'));
  const marginacionGeoJSON = JSON.parse(fs.readFileSync('./src/data/imu-2020.geojson', 'utf8'));

  // Leer datos de ingresos y gastos de los hogares (ENIGH)
  const enighData = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream('./src/data/enigh.csv')
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

  // Crear un arreglo para almacenar los resultados
  const joinedResults = [];

  // Analizar los datos
  censoData.features.forEach((censoFeature) => {
    const censoProps = censoFeature.properties;
    const cve_ageb = censoProps.CVE_AGEB;

    // Filtrar todas las coincidencias en el archivo de aforo para este CVE_AGEB
    const aforoMatches = aforoData.features.filter((aforoFeature) => {
      const aforoProps = aforoFeature.properties;
      return (
        aforoProps.CVE_ENT === censoProps.CVE_ENT &&
        aforoProps.CVE_MUN === censoProps.CVE_MUN &&
        aforoProps.CVE_LOC === censoProps.CVE_LOC &&
        aforoProps.CVE_AGEB === cve_ageb
      );
    });

    // Si hay coincidencias en el archivo de aforo, calcular el promedio de aforo
    let aforoAvg = null;
    if (aforoMatches.length > 0) {
      const aforoSum = aforoMatches.reduce((sum, aforoFeature) => sum + (aforoFeature.properties.aforo || 0), 0);
      aforoAvg = aforoSum / aforoMatches.length;
    }

    // Si el promedio de aforo no es null, continuar con el análisis
    if (aforoAvg !== null) {
      // Buscar el grado de marginación y población total del archivo de marginación
      const marginacionFeature = marginacionGeoJSON.features.find((feature) => feature.properties.CVE_AGEB === cve_ageb);
      const gradoMarginacion = marginacionFeature ? marginacionFeature.properties.GM_2020 : null;
      const poblacionTotal = marginacionFeature ? marginacionFeature.properties.POB_TOTAL : null;

      // Crear el resultado con el CVE_AGEB, POBTOT, el promedio de aforo y el grado de marginación
      if (gradoMarginacion != null) {
        const resultado = {
          CVE_AGEB: cve_ageb,
          POBTOT: censoProps.POBTOT,
          AFORO: aforoAvg,
          gradoMarginacion,
        };

        joinedResults.push(resultado);
      }
    }
  });

  return joinedResults;
}

