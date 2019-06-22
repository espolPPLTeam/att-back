"use strict";
module.exports = (sequelize, DataTypes) => {
  let ActualizacionEstado = sequelize.define(
    "ActualizacionEstado",
    {
      
    },
    {
      tableName: "actualizaciones_estado",
      underscored: true,
      name: {
        singular: "actualizacion_estado",
        plural: "actualizaciones_estado"
      },
      sequelize
    }
  );
  return ActualizacionEstado;
};
