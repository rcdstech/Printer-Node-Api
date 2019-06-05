const express = require('express');
const router = express.Router();
const scanToEmail = require('./scantoemail');
const allInOne = require('./allInOne');
const password = require('./password');
const isFile = false;
// All routes for /scanToEmail are send to scanToEmail Router
if(isFile) {
	router.use('/commandxml', scanToEmail);
} else {
	router.use('/commandxml', allInOne);
}

router.use('/password', password);

//export this router to use in our index.js
module.exports = router;
