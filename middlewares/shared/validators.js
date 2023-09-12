const User = require('../../api/models/user-model');

/**
 * isValidEmail helper method
 * @param {string} email
 * @returns {Boolean} True or False
 */
const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
 */
const validatePassword = (password) => {
  if (password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/)) {
    return true;
  }
  return false;
};

const checkEmailExists = async (email) => {
  const condition = `email='${email}'`;
  return User.getByCondtion(condition).then((result) => {
    if (result && result.length > 0) {
      return false;
    } else {
      return true;
    }
  });
};

const checkUserExists = async (name) => {
  const condition = `name=$${name}`;
  return User.getByCondtion(condition).then((result) => {
    if (result && result.length > 0) {
      return false;
    } else {
      return true;
    }
  });
};

const allPostCondition = (additional_params) => {
  return !additional_params.page_id || !additional_params.title || !additional_params.content || !additional_params.content_type ||
         !additional_params.category || !additional_params.image || !additional_params.release_date || !additional_params.source;
};

const customPostCondition =  (additional_params) => {
  return !additional_params.page_id || !additional_params.content || !additional_params.category;
};

module.exports = {
  validateEmail,
  validatePassword,
  checkEmailExists,
  checkUserExists,
  allPostCondition,
  customPostCondition
};