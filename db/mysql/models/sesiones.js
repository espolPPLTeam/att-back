"use strict";
module.exports = (sequelize, DataTypes) => {
  let Sesion = sequelize.define(
    "Sesion",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is missing",
          },
          notEmpty: {
            msg: "Name must not be empty",
          },
          not: {
            args: /[`~,<>;':"/[\]|{}()=_+-]/,
            msg: "Name cannot contain special characters",
          },
        },
      },
      activo: DataTypes.BOOLEAN,
      fecha_fin: DataTypes.DATE,
      fecha_inicio: DataTypes.DATE,
      /*estado_actual_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      }*/
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
      as: "estadoActual",
      foreignKey: "estado_actual_id",
      constraints: false
    });
    Sesion.belongsToMany(models.Usuario, { through: models.UsuarioSesion });
    Sesion.belongsTo(models.Usuario, {
      as: "registrador",
      foreignKey: "usuario_registro",
      constraints: false
    });

    Sesion.hasMany(models.PreguntaEstudiante, {
      as: "preguntasEstudiante"
    });
    Sesion.hasMany(models.PreguntaProfesor, {
      as: "preguntasProfesor"
    });
  };
  return Sesion;
};
