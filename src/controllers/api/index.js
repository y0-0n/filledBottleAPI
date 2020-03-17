const router = require('express').Router();
const auth = require('./auth');
const suggestion = require('./suggestion');
const manufacture = require('./manufacture');
const stock = require('./stock');
const produce = require('./produce');
const product = require('./product');
const plant = require('./plant');
const customer = require('./customer');

router.use('/auth', auth);
router.use('/customer', customer);
router.use('/suggestion', suggestion);
router.use('/manufacture', manufacture);
router.use('/stock', stock);
router.use('/produce', produce);
router.use('/product', product);
router.use('/plant', plant);

module.exports = router;