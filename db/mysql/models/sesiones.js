"use strict";
module.exports = (sequelize, DataTypes) => {
  let Sesion = sequelize.define(
    "Sesion",
    {
      nombre: DataTypes.STRING,
      activo: DataTypes.BOOLEAN,
      fecha_fin: DataTypes.DATE,
      fecha_inicio: DataTypes.DATE
    },
    {
      tableName: "sesiones",
      underscored: true,
      name: {
        singular: "sesion",
        plural: "sesiones"
      },
      sequelize,
    }
  );

  Sesion.associate = (models) => {
    Sesion.belongsTo(models.Paralelo);
    Sesion.belongsToMany(models.EstadoSesion, {
      through: models.ActualizacionEstado,
      as: "ActualizacionesEstado"
    });
    Sesion.belongsTo(models.EstadoSesion, {
      as: "sesionActual",
      foreignKey: "estado_actual_id",
      constraints: false
    });
    Sesion.belongsToMany(models.Usuario, { through: models.UsuarioSesion });
    Sesion.belongsTo(models.Usuario, {
      as: "registrador",
      foreignKey: "usuario_registro",
      constraints: false
    });

    Sesion.hasMany(models.PreguntaEstudiante);
    Sesion.hasMany(models.PreguntaProfesor, {
      as: "preguntasProfesor"
    });
  };
  return Sesion;
};
