const { MYSQL_DATABASE, MYSQL_USER, MYSQL_ROOT_PASSWORD, MYSQL_HOSTNAME } = require("../../constants");
module.exports = {
    development: {
        username: MYSQL_USER,
        password: MYSQL_ROOT_PASSWORD,
        database: MYSQL_DATABASE,
        host: MYSQL_HOSTNAME,
        logging: false,
        dialect: "mysql",
    },
    test: {
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        operatorsAliases: false,
    },
    production: {
        username: MYSQL_USER,
        password: MYSQL_ROOT_PASSWORD,
        database: MYSQL_DATABASE,
        host: MYSQL_HOSTNAME,
        logging: false,
        dialect: "mysql",
    },
};
