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
router.get('/total',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  suggestion.getTotal
);

router.get('/:page',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  suggestion.getList
);

router.get('/detail/:id',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  suggestion.getSuggestionById
);


router.post('/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  suggestion.addSuggestion
);


module.exports = router;