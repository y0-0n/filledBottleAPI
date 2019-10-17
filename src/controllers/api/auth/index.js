const router = require('express').Router();
const signup = require('./signup');
const { check } = require('express-validator');

/**
 * POST /api/auth/emailCheck
*/
router.post('/emailCheck', [
  // username must be an email
  check('email').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
], signup.emailCheck);

module.exports = router;