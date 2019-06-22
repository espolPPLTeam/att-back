"use strict";
module.exports = (sequelize, DataTypes) => {
  let ParaleloUsuario = sequelize.define(
    "ParaleloUsuario",
    {},
    {
      tableName: "paralelos_usuarios",
      underscored: true,
      name: {
        singular: "paralelos_usuarios",
        plural: "paralelos_usuarios"
      }
    }
  );
  return ParaleloUsuario;
};
