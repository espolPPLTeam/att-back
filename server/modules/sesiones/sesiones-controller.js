const { Mysql } = require("./../../../db");
const db = Mysql.db;

/** ID del estado de una sesion terminada */
const SESION_TERMINADA = 3;

/**
  * Crea un registro de una sesion en esato PENDIENTE
  * Una sesion pertenece a un paralelo
  *
  * @param {Object} datosSesion
  * @param {Number} datosSesion.idParalelo ID del paralelo al que pertenece la sesion
  * @param {String} datosSesion.nombre Nombre de la sesion a crear
  * @param {Object} datosUsuario
  * @param {Number} datosUsuario.id Id del usuario que crea la sesion
  */
async function crearSesion(datosSesion, datosUsuario) {
  try {
    const paraleloQuery = { id: datosSesion.idParalelo };
    const paralelo = await db["Paralelo"].findOne({ where: paraleloQuery });
    if (!paralelo) {
      return Promise.reject("Paralelo not found.");
    }

    const estadoQuery = { nombre: "PENDIENTE" };
    const estado = await db["EstadoSesion"].findOne({ where: estadoQuery });

    let data = {
      nombre: datosSesion.nombre,
      activo: false,
      estado_actual_id: estado.id,
    };
    const sesion = await db["Sesion"].create(data);

    sesion.setParalelo(paralelo.id);
    // sesion.setEstadoActual(estado.id);
    sesion.setRegistrador(datosUsuario.id);

    return Promise.resolve(sesion);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

async function obtenerSesiones(queryData) {
  try {
    const sesionQuery = {
      paralelo_id: queryData.paralelo,
    };
    let sesiones = await db["Sesion"].findAll({
      where: sesionQuery,
      attributes: ["nombre", "activo", "id"],
      include: [
        {
          model: db["Paralelo"],
          attributes: ["nombre", "codigo", "id"],
          include: [
            {
              model: db["Materia"],
              attributes: ["nombre", "codigo", "id"],
            }
          ]
        },
        {
          model: db["EstadoSesion"],
          as: "estadoActual",
          attributes: ["id", "nombre"]
        }
      ]
    });
    if (!sesiones) {
      sesiones = [];
    }

    return Promise.resolve(sesiones);
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
  * Da por iniciada una sesion previamente creada
  *
  * @param {Object} datosSesion
  * @param {Number} datosSesion.idSesion ID de la sesion a iniciar
  */
async function iniciarSesion(datosSesion) {
  try {
    const sesionQuery = { id: datosSesion.idSesion };
    const sesion = await db["Sesion"].findOne({ where: sesionQuery });
    if (!sesion) {
      return Promise.reject("Sesion no existe");
    }
    if (sesion.get("estado_actual_id") == SESION_TERMINADA) {
      return Promise.reject("Sesion finalizada. No se puede actualizar");
    }

    const estadoQuery = { nombre: "ACTIVA" };
    const estado = await db["EstadoSesion"].findOne({ where: estadoQuery });

    await sesion.update({
      estado_actual_id: estado.id,
      fecha_inicio: new Date()
    });

    await sesion.addActualizacionesEstado(estado.id);

    return Promise.resolve(sesion);
  } catch (error) {
    console.error(error);
    return error;
  }
};

/**
  * Da por finalizada una sesion previamente creada
  *
  * @param {Object} datosSesion
  * @param {Number} datosSesion.idSesion ID de la sesion a iniciar
  */
async function terminarSesion(datosSesion) {
  try {
    const sesionQuery = { id: datosSesion.idSesion };
    const sesion = await db["Sesion"].findOne({ where: sesionQuery });
    if (!sesion) {
      return Promise.reject("Sesion no existe");
    }
    if (sesion.get("estado_actual_id") == SESION_TERMINADA) {
      return Promise.reject("Sesion finalizada. No se puede actualizar");
    }

    const estadoQuery = { nombre: "TERMINADA" };
    const estado = await db["EstadoSesion"].findOne({ where: estadoQuery });

    await sesion.update({
      estado_actual_id: estado.id,
      fecha_fin: new Date()
    });

    await sesion.addActualizacionesEstado(estado.id);

    return Promise.resolve(sesion);
  } catch (error) {
    console.error(error);
    return error;
  }
};


/**
  * Devuelve los datos de preguntas de una sesion
  *
  * @param {Object} datosSesion
  * @param {Number} datosSesion.idSesion
  */
async function obtenerDatosSesion(datosSesion, datosUsuario) {
  try {
    const sesionQuery = { id: datosSesion.idSesion };
    const sesionProjection = ["nombre", "fecha_inicio", "fecha_fin"];
    const usuarioProjection = ["id", "nombres", "apellidos", "email"];
    const sesionPopulate = [
      {
        model: db["Paralelo"],
        attributes: ["nombre", "codigo", "id"]
      },
      {
        model: db["Usuario"],
        as: "registrador",
        attributes: usuarioProjection
      },
      {
        model: db["PreguntaProfesor"],
        as: "preguntasProfesor",
        attributes: ["id", "texto", "imagen", "createdAt", "titulo"],
        include: [
          {
            model: db["Respuesta"],
            as: "respuestas",
            attributes: ["id", "texto", "calificacion", "createdAt", "imagen"],
            include: [
              {
                model: db["Usuario"],
                as: "creador",
                attributes: ["id", "nombres", "apellidos", "email"],
              }
            ]
          },
          {
            model: db["Usuario"],
            as: "creador",
            attributes: usuarioProjection
          }
        ],
      },
      {
        model: db["PreguntaEstudiante"],
        as: "preguntasEstudiante",
        attributes: ["id", "texto", "imagen", "createdAt"],
        include: [
          {
            model: db["Usuario"],
            as: "creador",
            attributes: usuarioProjection
          }
        ],
      },
      {
        model: db["EstadoSesion"],
        as: "estadoActual",
        attributes: ["id", "nombre"]
      }
    ];
    const sesion = await db["Sesion"].findOne({
      where: sesionQuery,
      attributes: sesionProjection,
      include: sesionPopulate
    });
    if (!sesion) {
      return Promise.reject("Sesion no existe");
    }
    return Promise.resolve(sesion);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

module.exports = {
  crearSesion,
  iniciarSesion,
  terminarSesion,
  obtenerDatosSesion,
  obtenerSesiones,
};
