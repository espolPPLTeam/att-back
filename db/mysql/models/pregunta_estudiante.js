"use strict";
module.exports = (sequelize, DataTypes) => {
    var PreguntaEstudiante = sequelize.define(
        "PreguntaEstudiante",
        {
            texto: DataTypes.STRING,
            destacada: DataTypes.STRING,
            calificacion: DataTypes.INTEGER,
        },
        {
            tableName: "preguntas_estudiante",
        }
    );
    PreguntaEstudiante.associate = (models) => {
        PreguntaEstudiante.hasMany(models.Mensaje, {
            foreignKey: "tipo_id",
            constraints: false,
            scope: {
                tipo: "pregunta_estudiante",
            },
        });
    };

    return PreguntaEstudiante;
};
