const {
    create,
    update,
    getAll,
    findById,
    getByCondtion,
    updateByCondition,
    remove,
    removeAll
  } = require("../../middlewares/utils/db-service");
  
  const TABLE = "tokens";
  
  const Token = function(token) {
    this.email = token.email;
    this.token = token.token;
    this.status = token.status;
  };
  
  Token.create = async(token) => await create(token, TABLE);

  Token.update = async(data, condition) => await update(data, condition, TABLE);
  
  Token.findById = async (id) => await findById(id, TABLE);
  
  Token.getAll = async () => await getAll(TABLE);
  
  Token.getByCondtion = async (condition) => await getByCondtion(condition, TABLE);
  
  Token.updateByCondition = async (condition) => {
    const query = `UPDATE ${TABLE} SET ${condition}`;
    await updateByCondition(query, TABLE);
  }  
  Token.remove = async (condition) => await remove(condition, TABLE);
  
  Token.removeAll = async () => await removeAll(TABLE);
  
  module.exports = Token;