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
};

module.exports = GroupService;
