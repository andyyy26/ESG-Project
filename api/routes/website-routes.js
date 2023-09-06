'use strict';
module.exports = (app) => {
  const website = require('../controllers/website-controller');

  app
  .route('/api/v1/profile/:user_id')
  .get(website.getProfile)
  
  app
  .route('/api/v1/save_form')
  .post(website.saveForm);
};