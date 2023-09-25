const _ = require("lodash");
const Form = require("../models/form-model");
const Post = require("../models/post-model");
const Contact = require("../models/contact-model");
const User = require('../models/user-model');
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

exports.getUserInfo = async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res.status(400).send({
      message: "User id is required!"
    });
  }

  const condition = `id='${user_id}'`;
  const userInfos = await User.getByCondtion(condition);
  const userInfo = userInfos.shift();
  console.log(JSON.stringify(userInfo));
  res.status(200).json({
    success: true,
    message: 'Get data successfully',
    data: { user_name: userInfo.user_name, email: userInfo.email }
  });

}
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
  const { page_id, category, limit, offset } = req.query;
  let condition;
  let results;
  try {
    if(page_id === pageEnum.ACTIVITIES && !category) {
      results = await Post.getAndUnion(postColumnEnum.CATEGORY, '*', categoryEnum, limit, offset);
      return res.send(results);
    }

    if(page_id === pageEnum.ACTIVITIES && category) {
      condition = `category='${category}' AND status='PUBLISH' LIMIT ${offset},${limit}`;
      results = await Post.getByCondtion(condition);
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

exports.getFormData = async (req, res) => {
  let availableFiedls = {};
  let formData;
  const fields = "id, form_id, data"

  try {
    const { limit, offset, additional_params } = req.body;
    if (_.isEmpty(additional_params)) {
      formData = await Form.getByFields(fields);
      return res.status(200).json({
        message: "success",
        data: {
          total: formData.length,
          page: offset / limit + 1,
          results: formData.slice(offset, limit + offset)
        }
      });
    }
    const { form_id } = additional_params;

    if (form_id) {
      availableFiedls.form_id = form_id.trim();
    }

    let condition = "";
    const keys = Object.keys(availableFiedls)
    const conditions = keys.map(key => {
      console.log(key);
      switch (key) {
        default:
          condition = `${key}='${availableFiedls[key]}'`;
      }

      if (keys.indexOf(key) !== keys.length - 1) {
        condition += " AND";
      }
      return condition;
    });

    const finalCondition = conditions.join(" ");
    formData = await Form.getFieldsByCondition(fields, finalCondition);
    res.status(200).json({
      message: "success",
      data: {
        total: formData.length,
        page: offset / limit + 1,
        results: formData.slice(offset, limit + offset)
      }
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "form data."
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
    const condition = `CONCAT_WS(content, title, source) like '%${query}%' AND status='PUBLISH' LIMIT ${offset},${limit}`;
    const profile = await Post.getByCondtion(condition);
    res.send(profile);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "posts."
    });
  }
};

// Save message
exports.saveMessage = async (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Body content can not be empty!"
    });
  }

  const { full_name, email, phone_number, message } = req.body;


  // Parse data to Contact
  const contact = new Contact({
    full_name: full_name,
    email: email,
    phone_number: phone_number,
    message: message
  });

  // Save message in the database
  try {
    const result = await Contact.create(contact);
    res.status(200).json({
      success: true,
      message: 'Save message successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      message: CREATED_ERROR + "message." + ` Error: ${err}`
    });
  }
};