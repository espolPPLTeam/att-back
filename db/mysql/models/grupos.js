"use strict";
module.exports = (sequelize, DataTypes) => {
  let Grupo = sequelize.define(
    "Grupo",
    {
      nombre: DataTypes.STRING,
    },
    {
      tableName: "grupos",
      underscored: true,
      name: {
        singular: "grupo",
        plural: "grupos"
      },
      sequelize,
    }
  );

  Grupo.associate = (models) => {
    Grupo.belongsTo(models.Paralelo);
    Grupo.belongsToMany(models.Usuario, { through: "estudiantes_grupos" });
    Grupo.belongsToMany(models.Usuario, { through: "profesores_grupos" });
    Grupo.belongsTo(models.Usuario, {
      as: "usuarioRegistro",
      foreignKey: "usuario_registro",
      constraints: false
    });
  };
  return Grupo;
};
