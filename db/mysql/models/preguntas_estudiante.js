"use strict";
module.exports = (sequelize, DataTypes) => {
  let PreguntaEstudiante = sequelize.define(
    "PreguntaEstudiante",
    {
      texto: DataTypes.STRING,
      calificacion: DataTypes.DECIMAL(10, 2),
      imagen: DataTypes.STRING,
    },
    {
      tableName: "preguntas_estudiante",
      underscored: true,
      name: {
        singular: "pregunta_estudiante",
        plural: "preguntas_estudiante"
      },
      sequelize,
    }
  );

  PreguntaEstudiante.associate = (models) => {
    PreguntaEstudiante.belongsTo(models.Usuario, {
      as: "Creador",
      foreignKey: "creador_id"
    });
    PreguntaEstudiante.belongsTo(models.Usuario, {
      as: "Calificador",
      foreignKey: "calificador_id"
    });
    PreguntaEstudiante.belongsTo(models.Sesion, {
      as: "Sesion",
      foreignKey: "sesion_id"
    });
  };
  return PreguntaEstudiante;
};
