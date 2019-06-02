"use strict";
module.exports = (sequelize, DataTypes) => {
    var Usuario = sequelize.define(
        "Usuario",
        {
            nombres: DataTypes.STRING,
            apellidos: DataTypes.STRING,
            correo: DataTypes.STRING,
            clave: DataTypes.STRING,
            matricula: DataTypes.STRING,
            tipos_usuarios_id: DataTypes.INTEGER,
            estado: DataTypes.BOOLEAN,
        },
        {
            tableName: "usuarios",
        }
    );
    Usuario.associate = (models) => {
        Usuario.belongsTo(models.TiposUsuarios, {
            foreignKey: "tipos_usuarios_id",
        });
    };

    return Usuario;
};
