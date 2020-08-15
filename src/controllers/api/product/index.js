const router = require('express').Router();
const passport = require('passport');
const product = require('./product');

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

router.get('/familyId/:productId',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.getFamilyId
)

router.get('/stateCount',
	passport.authenticate('JWT', { session: false}),
	checkAuthed,
	product.getStateCount
)

//회원이 취급하는 품목군 리스트 주기
router.get('/familyList/:categoryId',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  product.getFamilyList
);

router.get('/allFamily/:categoryId',
  product.getAllFamily
);

router.get('/familyCategory',
  product.getFamilyCategory
);

router.get('/userFamilyCategory',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  product.getUserFamilyCategory
);

router.post('/modifyFamily', //영헌)현재 안쓰이는듯
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.modifyFamily
)

router.post('/modifyFamilyInPlant', //영헌)현재 안쓰이는듯
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.modifyFamilyInPlant
)

//해당 창고(id)에서 취급하는 품목 반환
router.get('/familyInPlant/:id',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.familyInPlant
)

router.get('/excel',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.excel
)

router.get('/list/open/:id',
	product.getOpenList
)

router.get('/detail/open/:id',
	product.getOpenDetail
)

//회원의 품목(활성) 전체 갯수
router.post('/total',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.getTotal
)

//회원의 품목(비활성) 전체 갯수
router.post('/total/unset',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.getTotalUnset
)

//로그인 이후 본인 상품(활성) 확인
router.post('/list',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.getAuthedList
)

//로그인 이후 본인 상품(비활성) 확인
router.post('/list/unset',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.getAuthedListUnset
)

//품목 정보 주기
router.get('/:id',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.getProduct
)

//품목 등록
router.post('/',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.addProduct
)

//품목 활성화
router.put('/activate',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.activate
)

//품목 비활성화
router.put('/deactivate',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.deactivate
)

//품목 수정
router.put('/modify/:id',
	passport.authenticate('JWT', { session: false }),
	checkAuthed,
	product.modifyProduct
)


module.exports = router;