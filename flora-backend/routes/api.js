const express = require('express');
const bouquetsRouter = require('./bouquetsRouter');

const router = express.Router();

router.use('/bouquets', bouquetsRouter);

module.exports = router;
