const express = require('express');
const router = express.Router();
const scanToEmail = require('./scantoemail');

// All routes for /scanToEmail are send to scanToEmail Router
router.use('/commandxml', scanToEmail);

//export this router to use in our index.js
module.exports = router;
