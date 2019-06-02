module.exports = {
    PORT: process.env.SERVER_PORT,
    IS_DEVELOPMENT: process.env.NODE_ENV === "development",
    IS_PRODUCTION: process.env.NODE_ENV === "production",
    IS_TESTING: process.env.NODE_ENV === "testing",
};
