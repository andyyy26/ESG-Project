const Page = require("../models/page-model");
const {
  create,
  getAll
} = require("../../middlewares/utils/db-service");
const { async } = require("crypto-random-string");

/**
 * List all
 * GET
 */
// exports.list = async (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: 'List all data',
//         data: {},
//       });
// };
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
    const result = await create(page);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Page."
    });
  }
};

exports.listAll = async(req, res) => {
  const title = req.query.title;
  try {
    const result = await getAll(title);
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving pages."
    });
  }
};