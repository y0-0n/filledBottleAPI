const router = require('express').Router();
const suggestion = require('./suggestion')

router.use('/suggestion', suggestion);

module.exports = router;