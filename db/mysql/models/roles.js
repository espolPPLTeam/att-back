"use strict";
module.exports = (sequelize, DataTypes) => {
  let Rol = sequelize.define(
    "Rol",
    {
      nombre: DataTypes.STRING,
    },
    {
      tableName: "roles",
      underscored: true,
      name: {
        singular: "rol",
        plural: "roles"
      },
      sequelize,
    }
  );

  Rol.associate = (models) => {
    Rol.hasMany(models.Usuario);
  };
  return Rol;
};
