'use strict';
module.exports = (app) => {
  const website = require('../controllers/website-controller');

  app
    .route('/api/v1/')
    .get(website.listAll);

  app
  .route('/api/v1/create_new_page')
  .post(website.create);

  app.route('/contact_us').post(website.getContactUs);

  app.route('/about_us').post(website.getAboutUs);

  app.route('/activities').post(website.getActivities);

  app.route('/resources').post(website.getResources);

  app.route('/know-about-us').post(website.getKnowAboutUs);

  app.route('/mai-content').post(website.getMainContent);

  app.route('/mai-content').post(website.getMainContent);

};

