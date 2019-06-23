const { Mysql } = require("./../../../db");
const db = Mysql.db;

async function crearParalelo(datosParalelo) {
  try {
    const paralelo = await db["Paralelo"].create({
      nombre: datosParalelo.nombre,
      codigo: datosParalelo.codigo,
    });

    await paralelo.setMateria(datosParalelo.idMateria);
    await paralelo.setTermino(datosParalelo.idTermino);

    return Promise.resolve(paralelo);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

module.exports = {
  crearParalelo,
};