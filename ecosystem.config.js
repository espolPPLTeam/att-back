module.exports = {
  apps: [
    {
      name: "att-back",
      script: "server.js",
      env: {
        COMMON_VARIABLE: "true",
      },
      env_production: {
        NODE_ENV: process.env.NODE_ENV,
      },
    },
  ],
};
