"use strict";
module.exports = (sequelize, DataTypes) => {
    var Preguntas = sequelize.define(
        "Pregunta",
        {},
        {
            tableName: "preguntas",
        }
    );
    Pregunta.associate = (models) => {
        Pregunta.hasOne(models.Mensaje, {
            foreignKey: "mensajes_id",
        });

        Pregunta.belongsTo(models.Usuario, {
            foreignKey: "usuarios_id",
        });
    };

    return Pregunta;
};
