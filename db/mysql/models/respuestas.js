"use strict";
module.exports = (sequelize, DataTypes) => {
    var Respuesta = sequelize.define(
        "Respuesta",
        {},
        {
            tableName: "respuestas",
        }
    );
    Respuesta.associate = (models) => {
        Respuesta.hasOne(models.Mensaje, {
            foreignKey: "mensajes_id",
        });

        Respuesta.belongsTo(models.Usuario, {
            foreignKey: "usuarios_id",
        });

        Respuesta.belongsTo(models.Pregunta, {
            foreignKey: "pregunta_id",
        });
    };

    return Respuesta;
};
