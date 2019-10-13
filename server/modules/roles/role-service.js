const { Mysql } = require("./../../../db");
const db = Mysql.db;

const RoleModel = "Rol";

const RoleService = {
  /** 
   * @param {string} roleName Name of the role to get
   */
  async getRoleByName(roleName) {
    const roleQuery = { nombre: roleName };
    const role = await db[RoleModel].findOne({ where: roleQuery });
    return role;
  }
};

module.exports = RoleService;
