const router = require('express').Router();
const auth = require('./auth');
const suggestion = require('./suggestion');
const produce = require('./produce');
const stock = require('./stock');

router.use('/auth', auth);
router.use('/suggestion', suggestion);
router.use('/produce', produce);
router.use('/stock', stock);

module.exports = router;