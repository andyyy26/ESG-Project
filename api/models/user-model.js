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
  
  User.create = async(user) => create(user, TABLE);
  
  User.findById = (id) => findById(id, TABLE);
  
  User.getAll = () => getAll(TABLE);
  
  User.getByCondtion = (condition) => getByCondtion(condition, TABLE);
  
  User.updateByCondition = (condition) => {
    const query = `UPDATE ${TABLE} SET ${condition}`;
    updateByCondition(query, TABLE);
  }
  
  User.remove = (condition) => remove(condition, TABLE);
  
  User.removeAll = () => removeAll(TABLE);
  
  module.exports = User;