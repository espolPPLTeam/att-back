"use strict";
module.exports = (sequelize, DataTypes) => {
  let EstudianteGrupo = sequelize.define(
    "EstudianteGrupo",
    {
      estado: DataTypes.STRING
    },
    {
      tableName: "estudiantes_grupos",
      underscored: true,
      name: {
        singular: "estudiantes_grupos",
        plural: "estudiantes_grupos"
      },
      sequelize
    }
  );
  return EstudianteGrupo;
};
