const bcrypt = require("bcrypt");

/**
  * Hash password using bcrypt
  * @param {String} plainTextPassword Password in plain text
  * @return {String}
  */
function hashPassword(plainTextPassword) {
  const saltRounds = 10;
  return bcrypt.hashSync(plainTextPassword, saltRounds);
};

module.exports = {
  hashPassword
};