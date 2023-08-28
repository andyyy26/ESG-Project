'use strict';
// const express = require('express');
// const router = express.Router();
// const { getContactUs, hompage } = require('../controllers/website-controller');
//
// router.get('/', hompage);
//
// module.exports = router;

module.exports = (app) => {
  const website = require('../controllers/website-controller');

  app.route('/api/v1/').get(website.list);

  app.route('/').post(website.getContactUs)
};

