const router = require('express').Router();
const suggestion = require('./suggestion')
const users = require('./users')

// router.use('/suggestion', suggestion);
router.use('/users', users);

module.exports = router;