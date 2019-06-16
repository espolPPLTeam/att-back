"use strict";
module.exports = (sequelize, DataTypes) => {
  let Materia = sequelize.define(
    "Materia",
    {
      nombre: DataTypes.STRING,
      codigo: DataTypes.STRING,
    },
    {
      tableName: "materias",
    }
  );
  return Materia;
};
