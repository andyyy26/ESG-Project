'use strict';
module.exports = (app) => {
  const website = require('../controllers/website-controller');
  const validation = require('../../middlewares/shared/token')

  app
    .route('/api/v1/profile')
    .get(validation.validateToken, website.getProfile)

  app
    .route('/api/v1/user_info')
    .get(validation.validateToken, website.getUserInfo)

  app
    .route('/api/v1/posts')
    .get(website.getPosts)

  app
    .route('/api/v1/form_history')
    .post(validation.validateToken, website.getFormData);

  app
    .route('/api/v1/post_detail')
    .get(website.getDetailPosts)

  app
    .route('/api/v1/save_form')
    .post(validation.validateToken, website.saveForm);

  app
    .route('/api/v1/search')
    .post(website.searchPosts);

  app
    .route('/api/v1/send_message')
    .post(website.saveMessage);

  app
    .route('/api/v1/form_detail')
    .get(validation.validateToken, website.getFormDataDetail)
};