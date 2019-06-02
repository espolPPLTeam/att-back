"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config.js")[env];
const { IS_DEVELOPMENT } = require("../../../constants");
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
    })
    .forEach((file) => {
        const model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

const Conectar = () => {
    return new Promise(function(resolve, reject) {
        sequelize
            .sync()
            .then(() => {
                return resolve(db);
            })
            .catch((err) => {
                if (IS_DEVELOPMENT) {
                    console.error("Unable to connect to the database:", err);
                }
                console.log(err);
                return reject(err);
            });
    });
};

const Desconectar = () => {
    return new Promise(function(resolve) {
        resolve(sequelize.close());
    });
};

const Limpiar = () => {
    return new Promise(function(resolve) {
        sequelize.sync({ force: true }).then((res) => {
            resolve(true);
        });
    });
};

module.exports = {
    Desconectar,
    Conectar,
    Limpiar,
    db,
};
