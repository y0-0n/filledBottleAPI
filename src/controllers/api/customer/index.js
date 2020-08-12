const router = require('express').Router();
const passport = require('passport');
const customer = require('./customer');

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

//고객의 주문 기록 보여주기
router.post('/getOrder',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.getOrder
);

//BASEURL/api/customer/total
router.post('/total/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.getTotal
);

module.exports = router;