const router = require('express').Router();
const passport = require('passport');
const product = require('./product');

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

router.get('/familyList',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  product.getFamilyList
);

router.post('/family',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  product.addFamily
);

module.exports = router;