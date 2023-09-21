'use strict';
module.exports = (app) => {
  const cms = require('../controllers/cms-controller');
  const validation = require('../../middlewares/shared/token')

  app
    .route('/api/v1/cms/upload_image')
    .post(validation.validateToken, cms.uploadImage);

  app
    .route('/api/v1/cms/upload_file')
    .post(validation.validateToken, cms.uploadFile);

  app
    .route('/api/v1/cms/posts')
    .post(validation.validateToken, cms.getPosts);
  
  app
    .route('/api/v1/cms/form_data')
    .post(validation.validateToken, cms.getFormData);

  app
    .route('/api/v1/cms/create_post')
    .post(validation.validateToken, cms.createPost);

  app
    .route('/api/v1/cms/update_post')
    .patch(validation.validateToken, cms.updatePost);

  app
    .route('/api/v1/cms/update_esg')
    .patch(validation.validateToken, cms.updateESG);

  app
    .route('/api/v1/cms/delete_post')
    .delete(validation.validateToken, cms.deletePost);

   app
    .route('/api/v1/cms/post_detail')
    .get(validation.validateToken, cms.getPostDetail)

  app
    .route('/api/v1/cms/form_detail')
    .get(validation.validateToken, cms.getFormDataDetail)

  app
    .route('/api/v1/cms/update_home_page')
    .patch(validation.validateToken, cms.updateHomePage)

  app
    .route('/api/v1/cms/list_messages')
    .get(validation.validateToken, cms.getMessages)
};