const obtenerDatosAgeb = require('./src/ageb_list');
const obtenerGastosPorMunicipio = require('./src/gatos_municipio');
const obtenerPatronesMovilidad = require('./src/patrones_movilidad');
const obtenerTiemposDeEspera = require('./src/tiempo_espera');

exports.handler = async (event, context) => {
    console.log("Main Index");

    const resultAgeb = await obtenerDatosAgeb();
    const resultGastos = await obtenerGastosPorMunicipio();
    const resultPatrones = await obtenerPatronesMovilidad();
    let resultTiempoEspera = await obtenerTiemposDeEspera();
    resultTiempoEspera = resultTiempoEspera.splice(0, 100)

    result = {
        "ageb_list": resultAgeb,
        "gastos_por_municipio": resultGastos,
        "patrones_movilidad": resultPatrones,
        "tiempos_espera": resultTiempoEspera
    }

    return {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST,GET,OPTIONS',
            'Content-Type': 'application/json'
        },
        statusCode: 200,
        body: JSON.stringify(result)
    };
};
