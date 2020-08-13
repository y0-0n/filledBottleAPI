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

//고객의 주문 갯수 보여주기
router.post('/total',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.total
);

//고객의 주문 unset 갯수 보여주기
router.post('/total/unset',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.totalUnset
);

//고객의 주문 list 보여주기
router.post('/list',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.list
);

//고객의 주문 list unset 보여주기
router.post('/list/unset',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.listUnset
);

//고객의 해당 거래처 주문 보여주기
router.get('/order/:id', //영헌) /:id???
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.getCustomerOrder
);

//고객 등록
router.post('/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.addCustomer
);

//고객 수정
router.put('/modify/:id',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.modifyCustomer
);

//고객 활성화
router.put('/activate',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.activateCustomer
);

//고객 비활성화
router.put('/deactivate',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  customer.deactivateCustomer
);

module.exports = router;