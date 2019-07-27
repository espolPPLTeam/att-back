"use strict";
module.exports = (sequelize, DataTypes) => {
  let Termino = sequelize.define(
    "Termino",
    {
      nombre: DataTypes.STRING,
      activo: DataTypes.BOOLEAN,
      fecha_fin: DataTypes.DATE,
      fecha_inicio: DataTypes.DATE
    },
    {
      tableName: "terminos",
      underscored: true,
      name: {
        singular: "termino",
        plural: "terminos"
      },
      sequelize
    }
  );
  Termino.associate = (models) => {
    Termino.hasMany(models.Paralelo);
    Termino.belongsTo(models.Usuario, {
      as: "usuarioRegistro",
      foreignKey: "usuario_registro",
      constraints: false
    });
  };
  return Termino;
};
