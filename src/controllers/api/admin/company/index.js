const router = require('express').Router();
const passport = require('passport');
const company = require('./company');
const auth = require('../../auth/auth');

router.get('/list',
  passport.authenticate('JWT', { session: false }),
  auth.checkAdmin,
  company.getListAdmin
);

router.get('/total',
  passport.authenticate('JWT', { session: false }),
  auth.checkAdmin,
  company.getTotalAdmin
);

module.exports = router;