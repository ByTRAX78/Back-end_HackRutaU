const fs = require('fs');
const csv = require('csv-parser');

module.exports = async () => {
    let gastosPorMunicipio = [];

    // Función para leer y procesar el archivo ENIGH
    await new Promise((resolve, reject) => {
        fs.createReadStream('./src/data/enigh.csv')
            .pipe(csv())
            .on('data', (row) => {
                // Extrae solo los datos de gasto público por municipio
                if (parseFloat(row['publico']) > 0) {
                    gastosPorMunicipio.push({
                        municipio: row['desc_mun'],
                        gasto_publico: parseFloat(row['publico'])
                    });
                }
            })
            .on('end', () => {
                console.log('Archivo ENIGH procesado');
                resolve();
            })
            .on('error', (error) => reject(error));
    });

    // Formato JSON con el título "gastos_por_municipio"
    return gastosPorMunicipio;
}

