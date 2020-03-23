const router = require('express').Router();
const passport = require('passport');
const plant = require('./plant');

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

router.get('/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  plant.getList
);

router.post('/',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	plant.add
);

router.post('/searchPlant',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	plant.searchPlant
);

router.put('/deactivate/:id',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	plant.deactivate
);


module.exports = router;