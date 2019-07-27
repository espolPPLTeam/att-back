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
      underscored: true,
      name: {
        singular: "materia",
        plural: "materias"
      },
      sequelize
    }
  );
  Materia.associate = (models) => {
    Materia.hasMany(models.Paralelo);
    Materia.belongsTo(models.Usuario, {
      as: "usuarioRegistro",
      foreignKey: "usuario_registro",
      constraints: false
    });
  };
  return Materia;
};
