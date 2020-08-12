const router = require('express').Router();
const passport = require('passport');
const customer = require('./company');
const auth = require('../../auth/auth');

router.get('/list',
  passport.authenticate('JWT', { session: false }),
  auth.checkAdmin,
  customer.getListAdmin
);

router.get('/total',
  passport.authenticate('JWT', { session: false }),
  auth.checkAdmin,
  customer.getTotalAdmin
);

module.exports = router;