const fs = require('fs');
const rawData = require('./data/horarios_camiones.json');
const obtenerTiemposDeEspera = require('./tiempo_espera');

module.exports = async () => {
  try {
    const horariosData = rawData;

    const resultadosEspera = horariosData.horarios_camiones.map(horario => ({
      ...horario,
      tiempo_espera_calculado: obtenerTiemposDeEspera(horario)
    }));

    console.log("process.env.OPENAI_API_KEY}", process.env.OPENAI_API_KEY);

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Usa la variable de entorno para la API Key
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `Genera nuevos horarios optimizados basados en los siguientes datos: ${JSON.stringify(resultadosEspera)}`,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud a la API: ${response.statusText}`);
    }

    const nuevosHorarios = await response.json();
    fs.writeFileSync(outputFilePath, JSON.stringify(nuevosHorarios, null, 2));

    console.log(`Nuevos horarios generados y guardados en ${outputFilePath}`);
  } catch (error) {
    console.log(error);
    console.error('Error al generar nuevos horarios:', error);
  }
}
