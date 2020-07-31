const router = require('express').Router();
const passport = require('passport');
const result = require('./result');
const auth = require('../auth/auth');

router.get('/product/:year/:month',
	passport.authenticate('JWT', { session: false }),
	auth.checkAuthed,
	result.getProductResult
)

module.exports = router;