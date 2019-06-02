"use strict";
module.exports = (sequelize, DataTypes) => {
    var Mensaje = sequelize.define(
        "Mensaje",
        {
            tipo: DataTypes.STRING,
            tipo_id: DataTypes.INTEGER,
        },
        {
            tableName: "mensajes",
        }
    );
    Mensaje.associate = (models) => {
        Mensaje.belongsTo(models.Respuesta, {
            foreignKey: "mensaje_id",
        });

        Mensaje.belongsTo(models.Pregunta, {
            foreignKey: "mensaje_id",
        });

        Mensaje.hasOne(models.PreguntaEstudiante, {
            foreignKey: "tipo_id",
        });

        Mensaje.hasOne(models.PreguntaProfesor, {
            foreignKey: "tipo_id",
        });

        Mensaje.hasOne(models.RespuestaEstudiante, {
            foreignKey: "tipo_id",
        });
    };

    return Mensaje;
};
