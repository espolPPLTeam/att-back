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
    Paralelo.belongsToMany(models.Usuario, { through: "paralelos_usuarios" });
    Paralelo.hasMany(models.Sesion);
    Paralelo.belongsTo(models.Usuario, {
      as: "usuarioRegistro",
      foreignKey: "usuario_registro",
      constraints: false
    });
  };
  return Paralelo;
};
