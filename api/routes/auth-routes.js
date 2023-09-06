'use strict';
module.exports = (app) => {
  const auth = require('../controllers/auth-controller');

  app
    .route('/api/v1/auth/sign_up')
    .post(auth.signUp);

  app
    .route('/api/v1/auth/sign_in')
    .post(auth.login);

  app
    .route('/api/v1/auth/password-reset/get_code')
    .post(auth.getResetPassCode);

  app
    .route('/api/v1/auth/password-reset/verify_code')
    .post(auth.resetPassword);

  app
  .route('/api/v1/auth/verify_token')
  .post(auth.validateToken);
};