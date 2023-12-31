const {
    create,
    getAll,
    getByLimit,
    getByFields,
    getFieldsByCondition,
    getAndUnion,
    findById,
    getByCondtion,
    updateByCondition,
    remove,
    removeAll
  } = require("../../middlewares/utils/db-service");
  
  const TABLE = "posts";
  
  const Post = function(post) {
    this.page_id = post.page_id;
    this.title = post.title;
    this.source = post.source;
    this.release_date = post.release_date;
    this.image = post.image;
    this.category = post.category;
    this.content = post.content;
    this.content_type = post.content_type;
    this.status = post.status;
    this.hot_news = post.hot_news;
    this.description = post.description;
  };
  
  Post.create = async(post) => await create(post, TABLE);
  
  Post.findById = async(id) => await findById(id, TABLE);
  
  Post.getAll = async() => await getAll(TABLE);

  Post.getByLimit = async(fields, limit) => await getByLimit(fields, limit, TABLE);
  
  Post.getByCondtion = async(condition) => await getByCondtion(condition, TABLE);

  Post.getByFields = async(fields) => await getByFields(fields, TABLE);

  Post.getFieldsByCondition = async(fields, condition) => await getFieldsByCondition(fields, condition, TABLE);

  Post.getAndUnion = async(column, fields, values, limit, offset) => await getAndUnion(column, fields, values, limit, offset, TABLE);
  
  Post.updateByCondition = async(condition, data) => {
    const query = `UPDATE ${TABLE} SET ${condition}`;
    await updateByCondition(data, query, TABLE);
  }
  
  Post.remove = async(condition) => await remove(condition, TABLE);
  
  Post.removeAll = async() => await removeAll(TABLE);
  
  module.exports = Post;