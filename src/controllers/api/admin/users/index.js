const router = require('express').Router();
const passport = require('passport');
const users = require('./users');
const auth = require('../../auth/auth');

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

router.post('/create',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	users.createAdmin
);

router.post('/list',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	users.getListAdmin
);

router.get('/total',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	users.getTotalAdmin
);

router.get('/detail/:id',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	users.getDetailAdmin
);

router.get('/detail/product/:id',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	users.getDetailProductAdmin
);


router.get('/productFamily/:id',
  passport.authenticate('JWT', { session: false }),
	auth.checkAdmin,
	users.getProductFamilyAdmin
);

module.exports = router;