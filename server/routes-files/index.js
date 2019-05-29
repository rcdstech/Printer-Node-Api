const express = require('express');
const router = express.Router();
const scanToEmail = require('./scantoemail');
const password = require('./password');

// All routes for /scanToEmail are send to scanToEmail Router
router.use('/commandxml', scanToEmail);

router.use('/password', password);

//export this router to use in our index.js
module.exports = router;
