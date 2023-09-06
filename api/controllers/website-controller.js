const Form = require("../models/form-model");
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

  // const decodeToken = JSON.parse(Buffer.from(encodingOrganization.split('.')[1], 'base64').toString());
  // console.log(JSON.stringify(decodeToken));

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
    res.send(result);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || CREATED_ERROR + "form."
    });
  }
};

// Save form
exports.getProfile = async (req, res) => {
  const { user_id } = req.params;
  try {
    const field = "user_id, form_id, organization";
    const condition = `user_id='${user_id}'`;
    const profile = await Form.getFieldsByCondition(field, condition);
    res.send(profile);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || RETRIEVE_ERROR + "profile."
    });
  }
};