"use strict";
module.exports = (sequelize, DataTypes) => {
  let EstadoSesion = sequelize.define(
    "EstadoSesion",
    {
      nombre: DataTypes.STRING,
    },
    {
      tableName: "estados_sesion",
      underscored: true,
      name: {
        singular: "estado_sesion",
        plural: "estados_sesion"
      },
      sequelize,
    }
  );

  EstadoSesion.associate = (models) => {
    EstadoSesion.belongsToMany(models.Sesion, { through: models.ActualizacionEstado });
    EstadoSesion.belongsTo(models.Usuario, {
      as: "usuarioRegistro",
      foreignKey: "usuario_registro",
      constraints: false
    });
  };
  return EstadoSesion;
};
