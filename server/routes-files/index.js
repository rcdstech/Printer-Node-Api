const express = require('express');
const router = express.Router();
const allInOne = require('./allInOne');

	router.use('/commandxml', allInOne);

	router.use('/commandjson', allInOne);


//export this router to use in our index.js
module.exports = router;
