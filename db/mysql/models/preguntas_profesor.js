"use strict";
module.exports = (sequelize, DataTypes) => {
  let PreguntaProfesor = sequelize.define(
    "PreguntaProfesor",
    {
      texto: DataTypes.STRING,
      imagen: DataTypes.STRING,
    },
    {
      tableName: "preguntas_profesor",
      underscored: true,
      name: {
        singular: "pregunta_profesor",
        plural: "preguntas_profesor"
      },
      sequelize,
    }
  );

  PreguntaProfesor.associate = (models) => {
    PreguntaProfesor.belongsTo(models.Usuario, {
      as: "creador",
      foreignKey: "creador_id"
    });
    PreguntaProfesor.belongsTo(models.Sesion, {
      as: "sesion",
      foreignKey: "sesion_id"
    });
    PreguntaProfesor.hasMany(models.Respuesta, {
      as: "respuesta",
      foreignKey: "pregunta_id"
    });
  };
  return PreguntaProfesor;
};
