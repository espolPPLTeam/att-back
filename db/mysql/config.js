module.exports = {
  development: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOSTNAME,
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
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOSTNAME,
    logging: false,
    dialect: "mysql",
  },
};
