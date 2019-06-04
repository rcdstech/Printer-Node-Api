const express = require('express');
const router = express.Router();
const parser = require('../util/parser');
const AllInOne_Controller = require('../controller-files/allInOne');

// POST Route for to add new email[email address || ''] to file collection
router.post('/add', AllInOne_Controller.create);

// POST Route for to add new email[email address || ''] to file collection and having multi select option
// in printer
router.post('/createMulti/:canMultiSelect', AllInOne_Controller.createMulti);

// GET Route for to get XML whether if there is email than ok button or else textarea with button
router.get('/', AllInOne_Controller.getXml);

// POST Route for to get XML whether if there is email than ok button or else textarea with button
router.post('/', AllInOne_Controller.getXml);


// POST Route for to add new password to file collection
router.post('/password', AllInOne_Controller.createPassword);
router.post('/continue', AllInOne_Controller.continue);
router.get('/continue', AllInOne_Controller.continue);
module.exports = router;
