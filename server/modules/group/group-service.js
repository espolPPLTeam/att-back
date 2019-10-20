const { Mysql } = require("./../../../db");
const db = Mysql.db;

const GroupModel = "Grupo";

const GroupService = {
  /**
   * @param {number} groupID ID of the group to search
   */
  async getGroupByID(groupID) {
    const groupQuery = { id: groupID };
    return await db[GroupModel].findOne({
      where: groupQuery,
      attributes: ["id", "nombre", "paralelo_id"],
    });
  },
  /**
   * @param {object} groupData
   * @param {string} groupData.nombre Name of the group
   * @param {number} groupData.usuario_registro ID of the user who created the register
   * @param {number} groupData.courseID ID of the course this group belongs to
   */
  async createGroup(groupData) {
    const group = await db[GroupModel].create(groupData);
    await group.setParalelo(groupData.courseID);
    return group;
  }
};

module.exports = GroupService;
