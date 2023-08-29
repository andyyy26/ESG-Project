const Page = require("../models/page-model");

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
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Body content can not be empty!"
    });
  }

  const { id, title, description, image, status } = req.body;
  // Create a Tutorial
  const page = new Page({
    id: id,
    title: title,
    description: description,
    image: image,
    status: status
  });

  // Save Tutorial in the database
  Page.create(page, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Page."
      });
    else res.send(data);
  });
};

exports.listAll = (req, res) => {
  const title = req.query.title;
  Page.getAll(title, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving pages."
      });
    else res.send(data);
  });
};