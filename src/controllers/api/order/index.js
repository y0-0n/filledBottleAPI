const router = require('express').Router();
const passport = require('passport');
const order = require('./order');

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

//회원의 주문 전체 갯수 주기
router.post('/total',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.total
)

//회원의 전체 환불 갯수 목록
router.post('/total/refund',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	order.totalRefund
)

//회원의 주문 전체 목록 주기
router.post('/list',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.list
)

//회원의 전체 환불 주문 목록
router.post('/list/refund',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	order.listRefund
)

//회원의 오늘 주문 주기
router.get('/todayShipping',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.todayShipping
)

//회원의 주문 상품 주기
router.get('/order_product',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.orderProduct
)

//회원의 주문 내역 요약 주기
router.get('/order_summary',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.orderSummary
)

//회원의 월간 매출(운송 중) 주기
router.get('/income/:year/:month',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.incomeYM
)

//회원의 월간 매출(판매 완료) 주기
router.get('/receive/:year/:month',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.receiveYM
)

//회원의 월간 총 주문내역 갯수 주기
router.get('/amount/:year/:month',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.amountYM
)

//새로운 주문 등록
router.post('/',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.addOrder
)

//주문 상세정보 주기
router.get('/detail/:id',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.getDetail
)

//환불 주문 상세정보 주기
router.post('/detail/refund',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.getDetailRefund
)

//주문 상태 변경
router.post('/changeState',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.changeState
)

//주문 수정하기
router.put('/modify/:id',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	order.modifyOrder
)

module.exports = router;