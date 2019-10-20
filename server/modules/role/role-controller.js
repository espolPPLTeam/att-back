const RoleService = require("./role-service");

/**
  * Creates a role
  * @param {string} roleName Name of the role
  */
async function createRole(roleName) {
  try {
    const role = await RoleService.createRole(roleName);
    return Promise.resolve(role);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  createRole,
};
