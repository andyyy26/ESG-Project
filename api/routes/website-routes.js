'use strict';
module.exports = (app) => {
  const website = require('../controllers/website-controller');
  const validation = require('../../middlewares/shared/token')

  app
  .route('/api/v1/profile')
  .get(validation.validateToken, website.getProfile)

  app
  .route('/api/v1/posts')
  .get(validation.validateToken, website.getPosts)
  
  app
  .route('/api/v1/save_form')
  .post(validation.validateToken, website.saveForm);

  app
  .route('/api/v1/search')
  .post(validation.validateToken, website.searchPosts);
};