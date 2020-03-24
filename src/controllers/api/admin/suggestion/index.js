const router = require('express').Router();
const passport = require('passport');
const suggestion = require('./suggestion');

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

router.post('/list',
  passport.authenticate('JWT', { session: false }),
	checkAuthed,
	suggestion.getListAdmin
);

router.post('/answer',
  passport.authenticate('JWT', { session: false }),
	checkAuthed,
	suggestion.answer
);

router.get('/total',
  passport.authenticate('JWT', { session: false }),
	checkAuthed,
	suggestion.getTotalAdmin
);

router.get('/detail/:id',
  passport.authenticate('JWT', { session: false }),
	checkAuthed,
	suggestion.getDetailAdmin
);

module.exports = router;