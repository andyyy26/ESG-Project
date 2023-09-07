const Form = require("../models/form-model");
const Post = require("../models/post-model");
const { 
  CREATED_ERROR,
  RETRIEVE_ERROR
 } = require('../../middlewares/constant/const');
const jwt = require('jsonwebtoken');

// Save form
exports.saveForm = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Body content can not be empty!"
    });
  }

  const { user_id, form_id, data } = req.body;

  const encodingOrganization = jwt.sign(
    { organization: data.organizationProfile },
    process.env.JWT_SECRET
  );

  const encodingData = jwt.sign(
    { data: data },
    process.env.JWT_SECRET
  );

  // Parse data to Form
  const form = new Form({
    user_id: user_id,
    form_id: form_id,
    organization: encodingOrganization,
    data: encodingData
  });

  // Save form in the database
  try {
    const result = await Form.create(form);
    res.status(200).json({
      success: true,
      message: 'Save form data successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || CREATED_ERROR + "form."
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  const { user_id } = req.query;
  try {
    const field = "user_id, organization";
    const condition = `user_id = '${user_id}' LIMIT 1`;
    const profile = await Form.getFieldsByCondition(field, condition);
    res.send(profile);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "profile."
    });
  }
};

exports.getPosts = async (req, res) => {
  const { page_id, limit, offset } = req.query;
  try {
    const condition = `page_id = '${page_id}' LIMIT ${offset},${limit}`;
    const profile = await Post.getByCondtion(condition);
    res.send(profile);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "posts."
    });
  }
};