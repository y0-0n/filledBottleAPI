const router = require('express').Router();
const signup = require('./signup');
const { check } = require('express-validator');

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

router.options('/signup', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	next();
});

module.exports = router;