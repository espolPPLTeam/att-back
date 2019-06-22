"use strict";
module.exports = (sequelize, DataTypes) => {
  let Paralelo = sequelize.define(
    "Paralelo",
    {
      nombre: DataTypes.STRING,
      codigo: DataTypes.STRING,
    },
    {
      tableName: "paralelos",
      name: {
        singular: "paralelo",
        plural: "paralelos"
      },
      sequelize,
      underscored: true,
    }
  );

  Paralelo.associate = (models) => {
    Paralelo.belongsTo(models.Materia);
    Paralelo.belongsTo(models.Termino);
    Paralelo.hasMany(models.Grupo);
    Paralelo.belongsToMany(models.Usuario, { through: models.ParaleloUsuario });
    Paralelo.hasMany(models.Sesion);
  };
  return Paralelo;
};
