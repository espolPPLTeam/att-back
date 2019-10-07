"use strict";
module.exports = (sequelize, DataTypes) => {
  // const Grupo = sequelize.import("./grupos");
  let UsuarioSesion = sequelize.define(
    "UsuarioSesion",
    {
      calificacion: DataTypes.DECIMAL(10, 2),
      activo: {
        type: DataTypes.BOOLEAN,
        default: true,
      },
      /*grupo_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Grupo,
          key: "id"
        }
      }*/
    },
    {
      tableName: "usuarios_sesion",
      underscored: true,
      name: {
        singular: "usuario_sesion",
        plural: "usuarios_sesion"
      },
      sequelize,
    }
  );
  return UsuarioSesion;
};
