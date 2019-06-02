"use strict";
module.exports = (sequelize, DataTypes) => {
    var ParaleloUsuario = sequelize.define(
        "ParaleloUsuario",
        {},
        {
            tableName: "paralelos_usuarios",
        }
    );
    ParaleloUsuario.associate = (models) => {
        ParaleloUsuario.belongsTo(models.Paralelo, {
            foreignKey: "paralelos_id",
        });

        ParaleloUsuario.belongsTo(models.Usuario, {
            foreignKey: "usuario_id",
        });
    };

    return ParaleloUsuario;
};
