"use strict";
module.exports = (sequelize, DataTypes) => {
    var Termino = sequelize.define(
        "Termino",
        {
            nombre: DataTypes.STRING,
            desde: DataTypes.DATE,
            hasta: DataTypes.DATE,
        },
        {
            tableName: "terminos",
        }
    );
    Termino.associate = (models) => {
        Termino.hasMany(models.Paralelo, {
            foreignKey: "terminos_id",
        });
    };

    return Termino;
};
