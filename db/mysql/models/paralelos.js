"use strict";
module.exports = (sequelize, DataTypes) => {
    var Paralelo = sequelize.define(
        "Paralelo",
        {
            nombre: DataTypes.STRING,
            codigo: DataTypes.STRING,
            curso: DataTypes.STRING,
            estado: DataTypes.BOOLEAN,
            terminos_id: DataTypes.INTEGER,
        },
        {
            tableName: "paralelos",
        }
    );
    Paralelo.associate = (models) => {
        Usuario.belongsTo(models.Termino, {
            foreignKey: "terminos_id",
        });
    };

    return Paralelo;
};
