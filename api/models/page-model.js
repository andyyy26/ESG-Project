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

Page.create = async(page) => await create(page, TABLE);

Page.findById = async(id) => await findById(id, TABLE);

Page.getAll = async() => await getAll(TABLE);

Page.getByCondtion = async(condition) => await getByCondtion(condition, TABLE);

Page.updateByCondition = async(condition) => {
  const query = `UPDATE ${TABLE} SET ${condition}`;
  await updateByCondition(query, TABLE);
}

Page.remove = async(condition) => await remove(condition, TABLE);

Page.removeAll = async() => await removeAll(TABLE);

module.exports = Page;