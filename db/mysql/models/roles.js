"use strict";
module.exports = (sequelize, DataTypes) => {
  let Rol = sequelize.define(
    "Rol",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is missing"
          },
          notEmpty: {
            msg: "Name must not be empty",
          },
          isIn: {
            args: [["profesor", "estudiante", "admin"]],
            msg: "Name is not allowed",
          },
        },
      },
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
