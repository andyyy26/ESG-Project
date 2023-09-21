const {
    create,
    getAll,
    findById,
    getByCondtion,
    updateByCondition,
    remove,
    removeAll
  } = require("../../middlewares/utils/db-service");
  
  const TABLE = "contacts";
  
  const Contact = function(contact) {
    this.full_name = contact.full_name;
    this.email = contact.email;
    this.phone_number = contact.phone_number;
    this.message = contact.message;
  };
  
  Contact.create = async(contact) => await create(contact, TABLE);
  
  Contact.findById = async(id) => await findById(id, TABLE);
  
  Contact.getAll = async() => await getAll(TABLE);
  
  Contact.getByCondtion = async(condition) => await getByCondtion(condition, TABLE);
  
  Contact.updateByCondition = async(condition, data) => {
    const query = `UPDATE ${TABLE} SET ${condition}`;
    await updateByCondition(data, query, TABLE);
  }
  
  Contact.remove = async(condition) => await remove(condition, TABLE);
  
  Contact.removeAll = async() => await removeAll(TABLE);
  
  module.exports = Contact;