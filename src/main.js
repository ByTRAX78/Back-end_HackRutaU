const fs = require('fs');

// Cargar los archivos geojson
const aforoData = JSON.parse(fs.readFileSync('./files/aforo.geojson', 'utf8'));
const censoData = JSON.parse(fs.readFileSync('./files/censo-2020.geojson', 'utf8'));

// Crear un arreglo para almacenar los resultados
const joinedResults = [];

// Iterar sobre cada característica en el archivo de censo
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
    if (aforoMatches.length > 0) {
        const aforoSum = aforoMatches.reduce((sum, aforoFeature) => sum + (aforoFeature.properties.aforo || 0), 0);
        const aforoAvg = aforoSum / aforoMatches.length;

        // Crear el resultado con el CVE_AGEB, POBTOT y el promedio de aforo
        const resultado = {
            CVE_AGEB: cve_ageb,
            POBTOT: censoProps.POBTOT,
            AFORO: aforoAvg
        };
        joinedResults.push(resultado);
    }
});

// Guardar los resultados en un archivo JSON
fs.writeFileSync('./files/resultados_join.json', JSON.stringify(joinedResults, null, 2), 'utf8');
console.log("Resultados guardados en 'resultados_join.json'");