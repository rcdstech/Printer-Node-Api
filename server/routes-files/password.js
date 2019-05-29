const express = require('express');
const router = express.Router();
const parser = require('../util/parser');
const password = require('../controller-files/password');

// POST Route for to add new password to file collection
router.post('/add', password.create);

// GET Route for to get XML textarea[password] with button
router.get('/', password.getXml);

// POST Route for to get XML textarea[password] with button
router.post('/', password.getXml);

// send to multi Mail
router.post('/submit', parser, password.submit);
module.exports = router;
