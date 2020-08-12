const router = require('express').Router();
const suggestion = require('./suggestion')
const users = require('./users')
const company = require('./company')

// router.use('/suggestion', suggestion);
router.use('/users', users);
router.use('/company', company);

module.exports = router;