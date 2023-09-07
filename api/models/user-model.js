const {
    create,
    getAll,
    findById,
    getByCondtion,
    updateByCondition,
    remove,
    removeAll
  } = require("../../middlewares/utils/db-service");
  
  const TABLE = "users";
  
  const User = function(user) {
    this.id = user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.password = user.password;
  };
  
  User.create = async(user) => await create(user, TABLE);
  
  User.findById = async(id) => await findById(id, TABLE);
  
  User.getAll = async() => await getAll(TABLE);
  
  User.getByCondtion = async(condition) => await getByCondtion(condition, TABLE);
  
  User.updateByCondition = async(condition, data) => {
    const query = `UPDATE ${TABLE} SET ${condition}`;
    await updateByCondition(data, query, TABLE);
  }
  
  User.remove = async(condition) => await remove(condition, TABLE);
  
  User.removeAll = async() => await removeAll(TABLE);
  
  module.exports = User;