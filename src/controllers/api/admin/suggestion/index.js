const router = require('express').Router();
const passport = require('passport');
const suggestion = require('./suggestion');
const auth = require('../../auth/auth');


router.post('/list',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	suggestion.getListAdmin
);

router.post('/answer',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	suggestion.answer
);

router.get('/total',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	suggestion.getTotalAdmin
);

router.get('/detail/:id',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	suggestion.getDetailAdmin
);

module.exports = router;