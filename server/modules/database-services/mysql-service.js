const { Mysql } = require("./../../../db");
const db = Mysql.db;

  /**
    * Returns all registers from a table that match the query
    * @param {String} model Name of the model to get the registers from
    * @param {Object} query Object to filter the query
    * @param {Array} projection Fields to return from the query
    * @param {Number} limit Number of results to show
    * @param {Number} offset Number of results to skip
    */
  async function findAll(model, query, projection, limit, offset) {
    if (!limit) {
      limit = 10;
    }
    if (!offset) {
      offset = 0;
    }
    return db[model].findAll({
      where: query,
      attributes: projection,
      offset: offset,
      limit: limit,
    });
  }

  /**
    * Returns all registers from a table that match the query and populates the result with the corresponding assosiation
    * @param {String} model Name of the model to get the registers from
    * @param {Object} query Object to filter the query
    * @param {Array} projection Fields to return from the query
    * @param {Number} limit Number of results to show
    * @param {Number} offset Number of results to skip
    * @param {Object[]} associations Associations to populate each register
    * @param {String} associations[].model Name of the model to associate
    * @param {Object} associations[].where Query of the association
    */
  async function findAllPopulate(model, query, projection, limit, offset, associations) {
    return db[model].findAll({
      include: associations,
      where: query,
      attributes: projection,
      offset: offset,
      limit: limit,
    });
  }

  /**
    * Searches the table by the primary key
    * @param {String} model Name of the model to get the registers from
    * @param {Number} primaryKey Id of the register to search for
    */
  async function findByPrimaryKey(model, primaryKey) {
    return db[model].findByPK(primaryKey);
  }

  /**
    * Returns the first register that matches the query
    * @param {String} model Name of the model to get the register from
    * @param {Object} query Object to filter the query
    * @param {Array} projection Fields to return from the query
    */
  async function findOne(model, query, projection) {
    return db[model].findOne({
      where: query,
      attributes: projection
    });
  }

  /**
    * Returns the first register that matches the query
    * @param {String} model Name of the model to get the register from
    * @param {Object} query Object to filter the query
    * @param {Array} projection Fields to return from the query
    * @param {Object[]} associations Associations to populate each register
    * @param {String} associations[].model Name of the model to associate
    * @param {Object} associations[].where Query of the association
    */
  async function findOnePopulate(model, query, projection, associations) {
    return db[model].findOne({
      include: associations,
      where: query,
      attributes: projection
    });
  }

  /**
    * Stores an instance in the database
    * @param {String} model Name of the model to insert the register to
    * @param {Object} data Data to insert to the database
    */
  async function createRegister(model, data) {
    return db[model].create(data);
  }

  /**
    * Removes a register from the database
    * If the paranoid option is true, the register will not be deleted, instead the deletedAt column will be set to the current timestamp
    * @param {Any} registerInstance Instance of the register to delete
    */
  async function deleteRegister(registerInstance) {
    return registerInstance.destroy();
  }

  /**
    * Updates a register from the database
    * @param {Any} registerInstance Instance of the register to update
    * @param {Object} updateData Data to update
    */
  async function updateRegister(registerInstance, updateData) {
    return registerInstance.update(updateData);
  }


module.exports = {
  findAll,
  findAllPopulate,
  findOne,
  findOnePopulate,
  findByPrimaryKey,
  createRegister,
  deleteRegister,
  updateRegister
};
