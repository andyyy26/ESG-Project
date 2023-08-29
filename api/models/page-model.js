const {
  create,
  getAll,
  findById,
  getByCondtion,
  updateByCondition,
  remove,
  removeAll
} = require("../../middlewares/utils/db-service");

const TABLE = "pages";

const Page = function(page) {
  this.id = page.id;
  this.title = page.title;
  this.description = page.description;
  this.image = page.image;
  this.status = page.status;
};

Page.create = async(page) => create(page, TABLE);

Page.findById = (id) => findById(id, TABLE);

Page.getAll = () => getAll(TABLE);

Page.getByCondtion = (condition) => getByCondtion(condition, TABLE);

Page.updateByCondition = (condition) => {
  const query = `UPDATE ${TABLE} SET ${condition}`;
  updateByCondition(query, TABLE);
}

Page.remove = (condition) => remove(condition, TABLE);

Page.removeAll = () => removeAll(TABLE);

module.exports = Page;