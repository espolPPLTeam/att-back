"use strict";
module.exports = (sequelize, DataTypes) => {
    var PreguntaProfesor = sequelize.define(
        "PreguntaProfesor",
        {
            texto: DataTypes.STRING,
        },
        {
            tableName: "preguntas_profesor",
        }
    );
    PreguntaProfesor.associate = (models) => {
        PreguntaProfesor.hasMany(models.Mensaje, {
            foreignKey: "tipo_id",
            constraints: false,
            scope: {
                tipo: "pregunta_profesor",
            },
        });
    };

    return PreguntaProfesor;
};
