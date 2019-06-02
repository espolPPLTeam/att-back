"use strict";
module.exports = (sequelize, DataTypes) => {
    var PermisoTipoUsuario = sequelize.define(
        "PermisoTipoUsuario",
        {},
        {
            tableName: "permisos_tipos_usuarios",
        }
    );
    PermisoTipoUsuario.associate = (models) => {
        PermisoTipoUsuario.belongsTo(models.TiposUsuario, {
            foreignKey: "tipos_usuarios_id",
        });

        PermisoTipoUsuario.belongsTo(models.Permiso, {
            foreignKey: "permisos_id",
        });
    };

    return PermisoTipoUsuario;
};
