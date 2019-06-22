"use strict";
module.exports = (sequelize, DataTypes) => {
  let ProfesorGrupo = sequelize.define(
    "ProfesorGrupo",
    {},
    {
      tableName: "profesores_grupos",
      underscored: true,
      name: {
        singular: "profesores_grupos",
        plural: "profesores_grupos"
      },
      sequelize
    }
  );
  return ProfesorGrupo;
};
