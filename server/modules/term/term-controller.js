const TermService = require("./term-service");

/**
  * Metodo para crear un registro de terminos en la base de datos
  * @param {Object} termData
  * @param {String} termData.nombre
  * @param {Date} termData.fecha_inicio
  * @param {Date} termData.fecha_fin
  */
async function createTerm(termData, userData) {
  try {
    const data = {
      nombre: termData.nombre,
      fecha_inicio: new Date(termData.fecha_inicio),
      fecha_fin: new Date(termData.fecha_fin),
      usuario_registro: userData.id
    };
    const term = await TermService.createTerm(data);
    return Promise.resolve(term);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

/**
  * Metodo para dar por iniciado un termino
  * @param {Number} idTermino ID del termino a iniciar
  */
async function startTerm(idTermino) {
  try {
    const term = await TermService.getTermByID(idTermino);
    if (!term) {
      throw "Term not found";
    }
    await term.update({
      activo: true
    });
    return Promise.resolve(term);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

/**
  * Metodo para dar por finalizado un termino
  * @param {Number} idTermino ID del termino a finalizar
  */
async function endTerm(idTermino) {
  try {
    const term = await TermService.getTermByID(idTermino);
    if (!term) {
      throw "Term not found";
    }
    await term.update({
      activo: false
    });
    return Promise.resolve(term);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

module.exports = {
  createTerm,
  startTerm,
  endTerm,
};
