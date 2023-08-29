const Page = require("../models/page-model");
const { 
  CREATED_ERROR,
  RETRIEVE_ERROR
 } = require('../../middlewares/constant/const');

// Create new page
exports.create = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Body content can not be empty!"
    });
  }

  const { id, title, description, image, status } = req.body;
  // Create a page
  const page = new Page({
    id: id,
    title: title,
    description: description,
    image: image,
    status: status
  });

  // Save page in the database
  try {
    const result = await Page.create(page);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || CREATED_ERROR + "page."
    });
  }
};

exports.listAll = async(req, res) => {
  try {
    const result = await Page.getAll();
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "pages."
    });
  }
};
//"UPDATE pages SET title = ?, description = ?, status = ? WHERE id = ?"
