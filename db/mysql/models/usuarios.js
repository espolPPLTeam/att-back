"use strict";
module.exports = (sequelize, DataTypes) => {
  let Usuario = sequelize.define(
    "Usuario",
    {
      nombres: DataTypes.STRING,
      apellidos: DataTypes.STRING,
      email: DataTypes.STRING,
      clave: DataTypes.STRING,
      estado: DataTypes.STRING,
      matricula: DataTypes.STRING,
    },
    {
      tableName: "usuarios",
      underscored: true,
      name: {
        singular: "usuario",
        plural: "usuarios"
      },
      sequelize,
    }
  );

  Usuario.associate = (models) => {
    Usuario.belongsTo(models.Rol);
    Usuario.belongsToMany(models.Paralelo, { through: models.ParaleloUsuario });
    Usuario.belongsToMany(models.Grupo, { through: models.EstudianteGrupo });
    Usuario.belongsToMany(models.Grupo, { through: models.ProfesorGrupo });
    Usuario.belongsToMany(models.Sesion, { through: models.UsuarioSesion });
    Usuario.hasMany(models.PreguntaEstudiante, {
      as: "Creador",
      foreignKey: "creador_id"
    });
    Usuario.hasMany(models.PreguntaEstudiante, {
      as: "Calificador",
      foreignKey: "calificador_id"
    });
    Usuario.hasMany(models.PreguntaProfesor, {
      //as: "Creador",
      foreignKey: "creador_id"
    });
  };
  return Usuario;
};
