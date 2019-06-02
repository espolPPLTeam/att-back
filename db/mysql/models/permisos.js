"use strict";
module.exports = (sequelize, DataTypes) => {
    var Permiso = sequelize.define(
        "Termino",
        {
            nombre: DataTypes.STRING,
            descripcion: DataTypes.TEXT,
        },
        {
            tableName: "permisos",
        }
    );
    Permiso.associate = (models) => {};

    return Permiso;
};
