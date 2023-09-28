'use strict';
module.exports = (app) => {
  const auth = require('../controllers/auth-controller');
  const validation = require('../../middlewares/shared/token')

  app
    .route('/api/v1/auth/sign_up')
    .post(auth.register);

  app
    .route('/api/v1/auth/sign_in')
    .post(auth.login);

  app
    .route('/api/v1/auth/password_reset/get_code')
    .post(auth.getResetPassCode);

  app
    .route('/api/v1/auth/password_reset/verify_code')
    .post(auth.resetPassword);

  app
    .route('/api/v1/auth/reset_password')
    .post(validation.validateToken, auth.resetPasswordNoCode);

  app
    .route('/api/v1/auth/sign_out')
    .post(auth.logout)
};