const router = require('express').Router();
const passport = require('passport');
const company = require('./company');
const auth = require('../auth/auth');

router.get('/info',
  passport.authenticate('JWT', { session: false }),
  auth.checkAuthed,
  company.getInfo
);


module.exports = router;