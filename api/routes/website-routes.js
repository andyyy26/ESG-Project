'use strict';
module.exports = (app) => {
  const website = require('../controllers/website-controller');

  app
    .route('/api/v1/')
    .get(website.listAll);

  app
  .route('/api/v1/create_new_page')
  .post(website.create);

  app.route('/api/v1/').get(website.list);

  app.route('/').post(website.getContactUs)
};

