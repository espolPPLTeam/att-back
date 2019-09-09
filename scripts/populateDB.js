process.env.NODE_ENV = "development";

const data = require("./data");

const materiasController = require("../server/modules/materias/materias-controller");
const terminosController = require("../server/modules/terminos/terminos-controller");
const paralelosController = require("../server/modules/paralelos/paralelos-controller");
const rolesController = require("../server/modules/roles/roles-controller");
const estadosSesionesController = require("../server/modules/estados-sesiones/estadosSesiones-controller");
const usuariosController = require("../server/modules/usuarios/usuarios-controller");
const gruposController = require("../server/modules/grupos/grupos-controller");

const databases = require("../db");


async function init() {
  try {
    console.log("Conectando DB...");
    const mysqlDB = await databases.Mysql.connect();
    await databases.Mysql.clean();

    console.log("Creando roles...");
    for (let rol of data.roles) {
      await rolesController.crearRol(rol.nombre);
    }
    console.log("Creando admin...");
    let admin;
    for (let usuario of data.usuarios) {
      admin = await usuariosController.crearAdmin(usuario);
    }
    console.log("Creando terminos...");
    for (let termino of data.terminos) {
      await terminosController.crearTermino(termino, admin);
    }

    const terminoActual = 1;
    console.log("Creando materias y paralelos...");
    for (let materia of data.materias) {
      const materiaCreada = await materiasController.crearMateria(materia, admin);
      const paralelosMateria = data.paralelos.filter((paralelo) => paralelo.materia === materia.nombre);
      for (let paralelo of paralelosMateria) {
        paralelo["idMateria"] = materiaCreada.id;
        paralelo["idTermino"] = terminoActual;
        paraleloCreado = await paralelosController.crearParalelo(paralelo, admin);
        const gruposParalelo = data.grupos.filter((grupo) => grupo.paralelo == paraleloCreado.codigo && grupo.materia == materia.codigo);
        for (let grupo of gruposParalelo) {
          grupo["idParalelo"] = paraleloCreado.id;
          await gruposController.crearGrupo(grupo, admin);
        }
      }
    }
    console.log("Creando estados de sesion");
    for (let estado of data.estadosSesion) {
      await estadosSesionesController.crearEstado(estado, admin);
    }
    console.log("Listo");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
};

init();
