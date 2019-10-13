"use strict";
module.exports = (sequelize, DataTypes) => {
  let Usuario = sequelize.define(
    "Usuario",
    {
      nombres: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is missing",
          },
          notEmpty: {
            msg: "Name must not be empty",
          },
          not: {
            args: /[`~,<>;':"/[\]|{}()=_+-\d]/,
            msg: "Name must only contain letters",
          },
        },
      },
      apellidos: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Last name is missing",
          },
          notEmpty: {
            msg: "Last name must not be empty",
          },
          not: {
            args: /[`~,<>;':"/[\]|{}()=_+-\d]/,
            msg: "Last name must only contain letters",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email is missing",
          },
          notEmpty: {
            msg: "Email must not be empty",
          },
          isEmail: {
            msg: "Email not valid",
          },
        },
      },
      clave: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is missing",
          },
          notEmpty: {
            msg: "Password must not be empty",
          },
        },
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Status is missing"
          },
          notEmpty: {
            msg: "Status must not be empty",
          },
          isIn: {
            args: [["ACTIVO", "INACTIVO"]],
            msg: "Status not allowed",
          },
        },
      },
      matricula: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Identification is missing"
          },
          notEmpty: {
            msg: "Identification must not be empty",
          },
        },
      },
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
    Usuario.belongsToMany(models.Paralelo, { through: "paralelos_usuarios" });
    Usuario.belongsToMany(models.Grupo, { through: "estudiantes_grupos" });
    Usuario.belongsToMany(models.Grupo, { through: "profesores_grupos" });
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
