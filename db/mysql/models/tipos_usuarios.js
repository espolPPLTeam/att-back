"use strict";
module.exports = (sequelize, DataTypes) => {
    var TiposUsuario = sequelize.define(
        "TiposUsuario",
        {
            nombre: DataTypes.ENUM("profesor", "profesor_titular", "estudiante"),
        },
        {
            tableName: "tipos_usuarios",
        }
    );
    TiposUsuario.associate = (models) => {};

    return TiposUsuario;
};
