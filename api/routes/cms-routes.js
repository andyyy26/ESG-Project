'use strict';
module.exports = (app) => {
  const cms = require('../controllers/cms-controller');

  app
    .route('/api/v1/upload_image')
    .post(cms.uploadImage);

  app
    .route('/api/v1/upload_file')
    .post(cms.uploadFile);
};