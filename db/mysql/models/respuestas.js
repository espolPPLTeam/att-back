"use strict";
module.exports = (sequelize, DataTypes) => {
  let Respuesta = sequelize.define(
    "Respuesta",
    {
      texto: DataTypes.STRING,
      calificacion: DataTypes.DECIMAL(10, 2),
      imagen: DataTypes.STRING,
    },
    {
      tableName: "respuestas",
      underscored: true,
      name: {
        singular: "respuesta",
        plural: "respuestas"
      },
      sequelize,
    }
  );

  Respuesta.associate = (models) => {
    Respuesta.belongsTo(models.Usuario, {
      as: "Creador",
      foreignKey: "creador_id"
    });
    Respuesta.belongsTo(models.Usuario, {
      as: "Calificador",
      foreignKey: "calificador_id"
    });
    Respuesta.belongsTo(models.PreguntaProfesor, {
      as: "Pregunta",
      foreignKey: "pregunta_id"
    });
  };
  return Respuesta;
};
