process.env.NODE_ENV = "development";

const data = require("./data");

const materiasController = require("../server/modules/materias/materias-controller");
const terminosController = require("../server/modules/terminos/terminos-controller");
const paralelosController = require("../server/modules/paralelos/paralelos-controller");
const rolesController = require("../server/modules/roles/roles-controller");
const estadosSesionesController = require("../server/modules/estados-sesiones/estadosSesiones-controller");

const databases = require("../db");


async function init() {
  const mysqlDB = await databases.Mysql.connect();
  await databases.Mysql.clean();

  for (let rol of data.roles) {
    await rolesController.crearRol(rol.nombre);
  }

  for (let termino of data.terminos) {
    await terminosController.crearTermino(termino);
  }

  const terminoActual = 1;

  for (let materia of data.materias) {
    const materiaCreada = await materiasController.crearMateria(materia);
    const paralelosMateria = data.paralelos.filter((paralelo) => paralelo.materia === materia.nombre);
    for (let paralelo of paralelosMateria) {
      paralelo["idMateria"] = materiaCreada.id;
      paralelo["idTermino"] = terminoActual;
      await paralelosController.crearParalelo(paralelo);
    }
  }

  for (let estado of data.estadosSesion) {
    await estadosSesionesController.crearEstado(estado);
  }
};

init();