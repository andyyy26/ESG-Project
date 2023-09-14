const Form = require("../models/form-model");
const Post = require("../models/post-model");
const { 
  CREATED_ERROR,
  RETRIEVE_ERROR
 } = require('../../middlewares/constant/const');
const jwt = require('jsonwebtoken');
const {
  pageEnum,
  postColumnEnum,
  categoryEnum
} = require("../../middlewares/utils/enum");

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
      message: CREATED_ERROR + "form." + ` Error: ${err}`
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  const { user_id, form_id } = req.query;
  try {
    const field = "user_id, organization";
    const condition = `user_id = '${user_id}' AND form_id = '${form_id}' ORDER BY id DESC LIMIT 1`;
    const profileArr = await Form.getFieldsByCondition(field, condition);
    const profile = profileArr.pop()

    if (!profile) {
      const results = { 
        user_id: user_id,
        organization: null
      }
      res.send(results);
    } else {
      res.send(profile);
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "profile."
    });
  }
};

exports.getPosts = async (req, res) => {
  const { page_id, limit, offset } = req.query;
  let condition;
  let results;
  try {
    if(page_id === pageEnum.ACTIVITIES) {
      results = await Post.getAndUnion(postColumnEnum.CATEGORY, '*', categoryEnum, limit, offset);
      return res.send(results);
    }

    condition = `page_id='${page_id}' AND status='PUBLISH' LIMIT ${offset},${limit}`;
    results = await Post.getByCondtion(condition);
    res.send(results);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "posts."
    });
  }
};

exports.getDetailPosts = async (req, res) => {
  const { id } = req.query;
  try {
    const condition = `id='${id}'`;
    const profile = await Post.getByCondtion(condition);
    res.send(profile.pop());
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "posts."
    });
  }
};

exports.searchPosts = async (req, res) => {
  const { query, limit, offset } = req.body;
  try {
    const condition = `CONCAT_WS(content, title) like '%${query}%' AND status='PUBLISH' LIMIT ${offset},${limit}`;
    const profile = await Post.getByCondtion(condition);
    res.send(profile);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "posts."
    });
  }
};