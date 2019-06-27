const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

/**
  * Crea un hash de la contrasenna usando bcrypt
  * @param {String} plainTextPassword Password in plain text
  * @return {String}
  */
function hashPassword(plainTextPassword) {
  const saltRounds = 10;
  return bcrypt.hashSync(plainTextPassword, saltRounds);
};

/**
  * Usa la librer'ia bcrypt para comparar 2 contrasennas
  * @param {String} passwordDB Hash de contrasenna almacenada en DB
  * @param {String} passwordEntered Contrasenna ingresada en plain text por el usuario
  * @return {Promise<Boolean>}
  */
async function comparePassword(passwordDB, passwordEntered) {
  /** @type Boolean */
  const result = await bcrypt.compare(passwordEntered, passwordDB);
  return result;
};

/**
  * Crea un jsonwebtoken con ciertos datos del usuario
  * @param {Number} id
  * @param {String} email
  * @param {String} rol
  * @return {String}
  */
function createToken(id, email, rol) {
  const payload = {
    id: id,
    email: email,
    rol: rol
  };
  /** Encrypted jsonwebtoken */
  const token = jwt.sign(payload, SECRET);
  return token;
};

module.exports = {
  hashPassword,
  comparePassword,
  createToken
};