const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const { v4: uuidv4 } = require('uuid');
const {
  checkEmailExists,
  validateEmail,
  validatePassword
} = require('../../middlewares/shared/validators');
const { sendEmail } = require('../../middlewares/utils/email-service');
const User = require('../models/user-model');
const UserInfo = require('../models/user-info-model');

/**
 * Logs in
 * POST:
 * {
 *  "email": "",
 *  "password": "",
 *  "remember": boolean
 * }
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Please fill in all fields!',
      data: null,
    });
  } else {
    try {
      const condition = `email='${email}'`;
      const existedUser = await User.getByCondtion(condition);
      const user = existedUser.pop();
      if (!user) {
        res.status(400).json({
          success: false,
          message: 'The provided email is not registered.',
          data: null,
        });
      } else {
        const pwCheckSuccess = await bcrypt.compare(password, user.password);
        if (!pwCheckSuccess) {
          res.status(400).json({
            success: false,
            message: 'Password does not match.',
            data: null,
          });
        } else {
          let token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            {
              // TODO: SET JWT TOKEN DURATION HERE
              expiresIn: process.env.EXPIRES_IN,
            }
          );
          res.cookie('session', token, {
            expiresIn: process.env.EXPIRES_IN,
          });
          user.token = token;
          delete user.password;
          res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            data: { user: user }
          });
        }
      }
    } catch(err) {
      res.status(400).json({
        success: false,
        message: `Something went wrong. ${err}`,
        data: null,
      });
    }
  }
};

/**
 * Register
 * POST:
 * {
 *  "id": "string with unique uuid for DB queries without exposing DB ID"
 *  "firstName": "null", (firstName is optional)
 *  "lastName": "null", (lastName is optional)
 *  "email": "test@test.com",
 *  "password": "Abc123!"
 * }
 */
exports.register = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password
  } = req.body;
  const emailCheck = await checkEmailExists(email);
  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
      data: null,
    });
  } else if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
      data: null,
    });
  } else if (!validatePassword(password)) {
    res.status(400).json({
      success: false,
      message:
        'Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.',
      data: null,
    });
  } else if (!validateEmail(email)) {
    res.status(400).json({
      success: false,
      message: 'Email address has invalid format',
      data: null
    });
  } else if (!emailCheck) {
    res.status(400).json({
      success: false,
      message: 'User already exists',
      data: null
    });
  } else {
    try {
      const newUser = new User({
        id: uuidv4(),
        first_name: first_name ? first_name : '',
        last_name: last_name ? last_name : '',
        email: email,
        password: bcrypt.hashSync(password, 14)
      });
      const user = await User.create(newUser);
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.EXPIRES_IN,
        }
      );

      const secretCode = cryptoRandomString({
        length: 6,
      });
      const info = new UserInfo({
        email: user.email,
        code: secretCode,
      });
      await UserInfo.create(info);

      user.token = token;
      delete user.password;
      res.status(200).json({
        success: true,
        message: 'User created',
        data: { user: user }
      });
    } catch(err) {
      res.status(400).json({
        success: false,
        message: `Something went wrong. ${err}`,
        data: null
      });
    }
  }
};

/**
 * Sends a code to the user to allow them to reset their passowrd
 * POST
 * PARAMS:
 * {
 *   "email": ""
 * }
 */
exports.getResetPassCode = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({
      success: false,
      message: 'Please provide your registered email address!',
      data: null,
    });
  } else {
    try {
      const condition = `email='${email}'`;
      const existedUser = await User.getByCondtion(condition);
      const user = existedUser.pop();
      console.log(JSON.stringify(user));
      if (!user) {
        res.status(400).json({
          success: false,
          message: 'The provided email address is not registered!',
          data: null,
        });
      } else {
        const secretCode = cryptoRandomString({
          length: 6,
        });
        const info = new UserInfo({
          code: secretCode,
          email: email,
        });
        await UserInfo.create(info);
        const data = {
          from: `<${process.env.EMAIL}>`,
          to: email,
          subject: 'Your Password Reset Code for ESG',
          text: `Please use the following code within the next 10 minutes to reset your password on ESG: ${secretCode}`,
          html: `<p>Please use the following code within the next 10 minutes to reset your password on ESG: <strong>${secretCode}</strong></p>`,
        };
        await sendEmail(data);
        res.status(201).json({
          success: true,
          message: 'Code send successfully',
          data: null,
        });
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        message: 'Something went wrong getting a code to reset email',
        data: null,
      });
    }
  }
};

/**
 * Allows the user to reset their password by providing 2x new password and their code
 * POST
 * PARAMS:
 * {
 * "email": "",
 * "password": "",
 * "code": ""
 * }
 */
exports.resetPassword = async (req, res) => {
  const { email, password, code } = req.body;
  if (!email || !password || !code) {
    res.status(400).json({
      success: false,
      message: 'Please fill in all fields!',
      data: null,
    });
  } else if (!validatePassword(password)) {
    res.status(400).json({
      success: false,
      message:
        'Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.',
      data: null,
    });
  } else {
    try {
      const condition = `email='${email}'`;
      const response = await UserInfo.getByCondtion(condition);
      if (response.length === 0) {
        res.status(400).json({
          success: false,
          message:
            'The entered code is not correct. Please make sure to enter the code in the requested time interval.',
          data: null,
        });
      } else {
        const newHashedPw = bcrypt.hashSync(password, 10);
        const updatedCondition = `password = ? WHERE email = ?`
        await User.updateByCondition(
          updatedCondition,
          [newHashedPw, email]
        );
        await UserInfo.remove(condition);
        res.status(200).json({
          success: true,
          message: 'Password reset successfully',
          data: null,
        });
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        message: 'Something went wrong, please try again',
        data: null,
      });
    }
  }
};

exports.validateToken = async(req, res) => {
  const { token } = req.query;
  const decodeToken = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  const expireTimeInMilliseconds = decodeToken.exp * 1000; 
  if(expireTimeInMilliseconds >  Date.now()) {
    res.status(200).json({
      success: true,
      message: 'Valid token!!!',
      data: token,
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid token!!!',
      data: token,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.setHeader('Clear-Site-Data', '"cookies", "storage"');
    res.status(200).json({ status: 'success', message: 'You are logged out!' });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
  res.end();
}