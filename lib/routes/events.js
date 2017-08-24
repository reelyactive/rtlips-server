/**
 * Copyright reelyActive 2017
 * We believe in an open Internet of Things
 */


const express = require('express');
const path = require('path');


const router = express.Router();


router.route('')
  .post(function(req, res) {
    createEvent(req, res);
  });


/**
 * Create an event.
 * @param {Object} req The HTTP request.
 * @param {Object} res The HTTP result.
 */
function createEvent(req, res) {
  var event = req.body;

  req.rtlips.handleEvent(event, function(response, status) {
    res.status(status).json(response);
  });
}


module.exports = router;
