const router = require('express').Router();
const signup = require('./signup');
const { check } = require('express-validator');
const passport = require('../../../modules/passport');

const preventDupAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(400).json('ㅇㅇ');
  } else {
    next();
  }
};

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
router.post('/login', (req, res, next) =>
  passport.authenticate('local',
  function (err, user, info) {
    if(err) return next(err);
    if(!user) {
      res.header('Access-Control-Allow-Origin', 'http://cosimo.iptime.org:3000');
      res.header('Access-Control-Allow-Credentials', true);
      res.status(401).json({message: 'fail'});
    } else {
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        req.session.user = user;
        res.header('Access-Control-Allow-Origin', 'http://cosimo.iptime.org:3000')
        res.header('Access-Control-Allow-Credentials', true);
        return res.json(req.user);
      });  
    }
  },
  { session: false })(req, res, next)
);

router.options('/login', (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'http://cosimo.iptime.org:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});


router.options('/signup', (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	next();
});

module.exports = router;