const {
    create,
    getAll,
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
  };
  
  Post.create = async(post) => await create(post, TABLE);
  
  Post.findById = async(id) => await findById(id, TABLE);
  
  Post.getAll = async() => await getAll(TABLE);
  
  Post.getByCondtion = async(condition) => await getByCondtion(condition, TABLE);

  Post.getFieldsByCondition = async(fields, condition) => await getFieldsByCondition(fields, condition, TABLE);
  
  Post.updateByCondition = async(condition) => {
    const query = `UPDATE ${TABLE} SET ${condition}`;
    await updateByCondition(query, TABLE);
  }
  
  Post.remove = async(condition) => await remove(condition, TABLE);
  
  Post.removeAll = async() => await removeAll(TABLE);
  
  module.exports = Post;