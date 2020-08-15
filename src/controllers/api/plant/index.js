const router = require('express').Router();
const passport = require('passport');
const plant = require('./plant');
const auth = require('../auth/auth')

function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}
// 전체 창고 찾기
router.get('/', //영헌) BN-4 작업 이전 controller/plant.js의 get '/', 관리자 계정으로 권한 관리해야할듯
  passport.authenticate('JWT', { session: false }),
  auth.checkAdmin,
  plant.getAllPlant
);

// 회원의 전체 창고 찾기
router.get('/list', //영헌) BN-4 작업 이전 기존의 get '/'
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

// id 해당 창고 찾기
router.get('/:id', 
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  plant.getIdPlant
)

// 창고 영구 삭제(관리자 권한)
router.delete('/', 
  passport.authenticate('JWT', { session: false }),
  auth.checkAdmin,
  plant.deletePlant
)

module.exports = router;