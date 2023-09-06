const {
    create,
    getAll,
    findById,
    getByCondtion,
    updateByCondition,
    remove,
    removeAll
  } = require("../../middlewares/utils/db-service");
  
  const TABLE = "user_info";
  
  const UserInfo = function(userInfo) {
    this.email = userInfo.email;
    this.code = userInfo.code;
  };
  
  UserInfo.create = async(user) => await create(user, TABLE);
  
  UserInfo.findById = async (id) => await findById(id, TABLE);
  
  UserInfo.getAll = async () => await getAll(TABLE);
  
  UserInfo.getByCondtion = async (condition) => await getByCondtion(condition, TABLE);
  
  UserInfo.updateByCondition = async (condition) => {
    const query = `UPDATE ${TABLE} SET ${condition}`;
    await updateByCondition(query, TABLE);
  }  
  UserInfo.remove = async (condition) => await remove(condition, TABLE);
  
  UserInfo.removeAll = async () => await removeAll(TABLE);
  
  module.exports = UserInfo;