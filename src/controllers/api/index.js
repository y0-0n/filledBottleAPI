const router = require('express').Router();
const auth = require('./auth');
const suggestion = require('./suggestion');

router.use('/auth', auth);
router.use('/suggestion', suggestion);

module.exports = router;