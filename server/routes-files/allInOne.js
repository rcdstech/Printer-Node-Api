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

// GET Route for to render XML after enter email from Printer
router.get('/email', parser, AllInOne_Controller.getEmailXml);

// GET Route for to render xml from last given email
router.post('/email', parser, AllInOne_Controller.getEmailXml);


router.post('/sendToMail', parser, AllInOne_Controller.sendMail);

router.get('/sendToMail', AllInOne_Controller.sendMail);
// send to multi Mail
router.post('/sendToMultiMail', parser, AllInOne_Controller.sendToMultiMail);
// send to multi Mail
router.get('/sendToMultiMail', AllInOne_Controller.sendToMultiMail);
// // password //

// POST Route for to add new password to file collection
router.post('/password', AllInOne_Controller.createPassword);

// send to multi Mail
router.post('/submit', parser, AllInOne_Controller.submit);

// send to multi Mail
router.get('/submit', AllInOne_Controller.submit);

router.post('/message', AllInOne_Controller.createMessage);

router.post('/close', AllInOne_Controller.close);
module.exports = router;
