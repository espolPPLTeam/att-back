process.env.NODE_ENV = "development";

const data = require("./data");

const roleController = require("../server/modules/role/role-controller");
const userController = require("../server/modules/user/user-controller");
const termController = require("../server/modules/term/term-controller");
const subjectController = require("../server/modules/subject/subject-controller");
const courseController = require("../server/modules/course/course-controller");
const groupController = require("../server/modules/group/group-controller");
const sessionStatusController = require("../server/modules/session-status/sessionStatus-controller");

const databases = require("../db");


async function init() {
  try {
    console.log("Conectando DB...");
    const mysqlDB = await databases.Mysql.connect();
    await databases.Mysql.clean();

    console.log("Creando roles...");
    for (let rol of data.roles) {
      await roleController.createRole(rol.nombre);
    }
    console.log("Creando admin...");
    let admin;
    for (let usuario of data.usuarios) {
      admin = await userController.registerAdmin(usuario);
    }
    console.log("Creando terminos...");
    for (let termino of data.terminos) {
      await termController.createTerm(termino, admin);
    }

    const terminoActual = 1;
    console.log("Creando materias y paralelos...");
    for (let materia of data.materias) {
      const materiaCreada = await subjectController.createSubject(materia, admin);
      const paralelosMateria = data.paralelos.filter((paralelo) => paralelo.materia === materia.nombre);
      for (let paralelo of paralelosMateria) {
        paralelo["idMateria"] = materiaCreada.id;
        paralelo["idTermino"] = terminoActual;
        paraleloCreado = await courseController.createCourse(paralelo, admin);
        const gruposParalelo = data.grupos.filter((grupo) => grupo.paralelo == paraleloCreado.codigo && grupo.materia == materia.codigo);
        for (let grupo of gruposParalelo) {
          grupo["idParalelo"] = paraleloCreado.id;
          await groupController.crearGrupo(grupo, admin);
        }
      }
    }
    console.log("Creando estados de sesion");
    for (let estado of data.estadosSesion) {
      await sessionStatusController.crearEstado(estado, admin);
    }
    console.log("Listo");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(-1);
  }
};

init();
