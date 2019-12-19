const router = require('express').Router();
const signup = require('./signup');
const { check } = require('express-validator');
const user = require('./user');
const login = require('./login');
const passport = require('passport');

const preventDupAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(400).json('ㅇㅇ');
  } else {
    next();
  }
};

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

/**
 * POST /api/auth/emailCheck
**/
router.post('/emailCheck', [
  // username must be an email
  check('email').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
], signup.emailCheck);

/**
 * POST /api/auth/signup
**/
router.post('/signup', [
  check('email').isEmail(),
  check('name').isLength({ min: 2 }),
  check('password').isLength({ min: 5 })
], signup.addUser)

/**
 * POST /api/auth/login
 */
router.post('/login', 
  login.auth,
  login.authResponse
);

router.get('/info',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  user.getInfo
);

router.put('/info',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  user.updateInfo
);

module.exports = router;