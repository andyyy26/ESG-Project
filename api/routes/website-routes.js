'use strict';
module.exports = (app) => {
  const website = require('../controllers/website-controller');

  app
    .route('/api/v1/')
    .get(website.list);
};