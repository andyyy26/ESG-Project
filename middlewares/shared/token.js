const jwt = require('jsonwebtoken');
const Token = require('../../api/models/token-model');

const validateToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'Missing authorization token!',
    });
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: 'Token is not valid!'
        });
      }

      const condition = `token='${token}'`;
      const existedToken = await Token.getByCondtion(condition);

      console.log(`existed token: ${existedToken}`);
      if (!existedToken || existedToken.length <= 0) {
        return res.status(401).send({
          success: false,
          message: 'Token is not valid!'
        });
      }
      next();
    });
  } catch (err) {
    return res.status(401).send({
      success: false,
      message: `Token is not valid! Error: ${err}`,
    });
  }
};

module.exports = { validateToken };