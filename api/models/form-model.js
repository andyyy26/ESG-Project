const {
    create,
    getAll,
    getAllByFields,
    findById,
    getByCondtion,
    getFieldsByCondition,
    updateByCondition,
    remove,
    removeAll
  } = require("../../middlewares/utils/db-service");

  const TABLE = "forms";
  
  const Form = function(form) {
    this.user_id = form.user_id;
    this.form_id = form.form_id;
    this.organization = form.organization;
    this.data = form.data;
  };
  
  Form.create = async(form) => await create(form, TABLE);
  
  Form.findById = async(id) => await findById(id, TABLE);
  
  Form.getAll = async() => await getAll(TABLE);

  Form.getAllByFields = async() => await getAllByFields(fields, TABLE);
  
  Form.getByCondtion = async(condition) => await getByCondtion(condition, TABLE);

  Form.getFieldsByCondition = async(fields, condition) => await getFieldsByCondition(fields, condition, TABLE);
  
  Form.updateByCondition = async(condition) => {
    const query = `UPDATE ${TABLE} SET ${condition}`;
    await updateByCondition(query, TABLE);
  }
  
  Form.remove = async(condition) => await remove(condition, TABLE);
  
  Form.removeAll = async() => await removeAll(TABLE);
  
  module.exports = Form;