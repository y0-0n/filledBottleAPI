const router = require('express').Router();
const passport = require('passport');
const stock = require('./stock');

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
  stock.getStockQuantity
);

router.get('/order/:id',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockOrder
);

router.post('/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.createStock
);

router.post('/transport',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.transportStock
);

router.post('/last/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getLastStock
);

router.post('/history',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockHistoryList
)

router.post('/total',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockHistoryTotal
)

/*router.get('/list/:page',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockList
);*/

router.post('/list/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockList
);

//주문 등록시 재고 가져오기
router.get('/product/:id',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockProduct
);

router.post('/list/total',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockTotal
)

router.post('/list2/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockList3
);

router.post('/sum/',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockSum
);


router.get('/:stockId',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.getStockDetail
);

router.put('/:id',
  passport.authenticate('JWT', { session: false }),
  checkAuthed,
  stock.modifyStock
)

module.exports = router;