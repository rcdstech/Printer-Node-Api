const express = require('express');
const router = express.Router();
const parser = require('../util/parser');
const ScanToEmail_Controller = require('../controller-files/scanToEmail');

// POST Route for to add new email[email address || ''] to file collection
router.post('/add', ScanToEmail_Controller.create);

// POST Route for to add new email[email address || ''] to file collection and having multi select option
// in printer
router.post('/add/:canMultiSelect', ScanToEmail_Controller.create);

// GET Route for to get XML whether if there is email than ok button or else textarea with button
router.get('/', ScanToEmail_Controller.getXml);

// POST Route for to get XML whether if there is email than ok button or else textarea with button
router.post('/', ScanToEmail_Controller.getXml);

// GET Route for to render XML after enter email from Printer
router.get('/email', parser, ScanToEmail_Controller.getEmailXml);

// GET Route for to render xml from last given email
router.post('/email', parser, ScanToEmail_Controller.getEmailXml);


router.post('/sendToMail', parser, ScanToEmail_Controller.sendMail);

router.get('/sendToMail', ScanToEmail_Controller.sendMail);
// send to multi Mail
router.post('/sendToMultiMail', parser, ScanToEmail_Controller.sendToMultiMail);
module.exports = router;
