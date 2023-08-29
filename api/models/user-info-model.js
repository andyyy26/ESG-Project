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
  
  UserInfo.create = async(user) => create(user, TABLE);
  
  UserInfo.findById = (id) => findById(id, TABLE);
  
  UserInfo.getAll = () => getAll(TABLE);
  
  UserInfo.getByCondtion = (condition) => getByCondtion(condition, TABLE);
  
  UserInfo.updateByCondition = (condition) => {
    const query = `UPDATE ${TABLE} SET ${condition}`;
    updateByCondition(query, TABLE);
  }  
  UserInfo.remove = (condition) => remove(condition, TABLE);
  
  UserInfo.removeAll = () => removeAll(TABLE);
  
  module.exports = UserInfo;