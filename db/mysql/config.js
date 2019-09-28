module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
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
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    logging: false,
    dialect: "mariadb",
  },
};
