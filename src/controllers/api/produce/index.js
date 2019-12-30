const router = require('express').Router();
const passport = require('passport');
const produce = require('./produce');
const upload = require("../../../modules/fileUploadProduce");

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
  produce.getList
);

router.post('/total',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  produce.getTotal
);

router.get('/:id',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  produce.getDetail
);

router.post('/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  upload.single('file'),
  produce.create
)

module.exports = router;