"use strict";
module.exports = (sequelize, DataTypes) => {
    var RespuestaEstudiante = sequelize.define(
        "RespuestaEstudiante",
        {
            texto: DataTypes.STRING,
            destacada: DataTypes.STRING,
            calificacion: DataTypes.INTEGER,
        },
        {
            tableName: "respuestas_estudiante",
        }
    );
    RespuestaEstudiante.associate = (models) => {
        RespuestaEstudiante.hasMany(models.Mensaje, {
            foreignKey: "tipo_id",
            constraints: false,
            scope: {
                tipo: "respuesta_estudiante",
            },
        });
    };

    return RespuestaEstudiante;
};
