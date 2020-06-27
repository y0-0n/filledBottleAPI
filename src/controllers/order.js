'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;
const Stock = require('../models/Stock');


function checkAuthed(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "http://cosimo.iptime.org:3000");
    res.status(401).json({ message: 'Not logged in!' });
    //res.redirect(301, 'http://cosimo.iptime.org:3000/#/login')
  }
}

router.post('/total/refund/', checkAuthed, function(req, res) {
  let {first_date, last_date, keyword} = req.body;
  const name = keyword;
  let sql = `SELECT count(*) as total
             from \`order\` as A JOIN \`customer\` AS B JOIN \`users\` AS C JOIN \`order_product\` as D ON A.customer_id = B.id AND A.user_id = C.id AND A.id = D.order_id
             WHERE C.id='${req.user.id}' AND D.refund = true
             AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
             ${(name !== '' ? `AND B.name = '${name}'`: '')}`
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /order/total/:state : ' + rows);
    res.send(rows);
  });
});


router.post('/total/', checkAuthed, function(req, res) {
  let {first_date, last_date, process_, keyword} = req.body; // 상태로 검색
  let name = keyword, state = process_;
  let sql = `SELECT count(*) as total
             from \`order\` as A JOIN \`customer\` AS B JOIN \`users\` AS C ON A.customer_id = B.id AND A.user_id = C.id
             WHERE C.id='${req.user.id}'
             AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
             ${(state !== 'all' ? `AND A.state = '${state}'` : '')}
             ${(name !== '' ? `AND B.name = '${name}'`: '')}`
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /order/total/ : ' + rows);
    res.send(rows);
  });
});

router.post('/list/refund/', checkAuthed, function(req, res){
  let {first_date, last_date, keyword, page, limit} = req.body; // 상태로 검색
	let name = keyword;
	if(!limit) {
    limit = 15
  }
  let sql = `SELECT O.id, O.state, O.date, O.price, O.received, C.name, O.orderDate, C.set
						 from \`order\` AS O JOIN \`customer\` AS C ON O.customer_id = C.id
						 JOIN \`users\` as U ON O.user_id = U.id
						 JOIN \`order_product\` as OP ON O.id = OP.order_id
             WHERE U.id='${req.user.id}' AND OP.refund = true
             ${(name !== '' ? `AND C.name = '${name}'`: '')}
						 AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
						 GROUP BY O.id
             ORDER BY O.orderDate DESC
             ${(page !== 'all' ? `LIMIT ${limit*(page-1)}, ${limit}` : '')}`;
  //console.log(state, page, state !== 'all' || name !== '')
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /order/'+page+'/' + rows);
    res.send(rows);
  });
});

router.post('/list', checkAuthed, function(req, res){
  let {first_date, last_date, page, process_, keyword, limit} = req.body; // 상태로 검색
  if(!limit) {
    limit = 15
  }
  let name = keyword, state = process_;
  let sql = `SELECT A.id, A.state, A.date, A.price, A.received, B.name, A.orderDate, B.set
             from \`order\` AS A JOIN \`customer\` AS B JOIN \`users\` as C ON A.customer_id = B.id AND A.user_id = C.id
             WHERE C.id='${req.user.id}'
             ${(state !== 'all' ? `AND A.state = '${state}'` : '')}
             ${(name !== '' ? `AND B.name = '${name}'`: '')}
             AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
             ORDER BY A.orderDate DESC
             ${(page !== 'all' ? `LIMIT ${limit*(page-1)}, ${limit}` : '')}`;
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /order/'+page+'/'+state+' : ' + rows);
    res.send(rows);
  });
});

router.get('/order_product', function(req, res) {
  connection.query('SELECT * from order_product', function(err, rows) {
    if(err) throw err;

    console.log('GET /irder/order_product : ' + rows);
    res.send(rows);
  })
});

router.get('/order_summary', function(req, res) {
  connection.query('SELECT * from `order` as A JOIN `order_product` as B ON A.id = B.order_id', function(err, rows) {
    if(err) throw err;

    console.log('GET /order/order_summary : ' + rows);
    res.send(rows);
  })
});

router.get('/income/:year/:month', function(req, res) {
  connection.query(`SELECT SUM(OP.price) as sum
    FROM \`order\` as O JOIN order_product as OP ON O.id = OP.order_id
		WHERE ${req.params.month} = MONTH(O.date)
		AND ${req.params.year} = YEAR(O.date)
    AND O.state = 'shipping'
    AND O.user_id = ${req.user.id}
    `, function(err, rows) {
    if(err) throw err;
        
    console.log('GET /order/income : ' + rows);
    res.send(rows);
  })
})

router.get('/amount/:year/:month', function(req, res) {
  connection.query(`SELECT count(*) as amount
    FROM \`order\` as O
		WHERE ${req.params.month} = MONTH(O.date)
		AND ${req.params.year} = YEAR(O.date)
    AND O.state = 'shipping'
		AND O.user_id = ${req.user.id}
    `, function(err, rows) {
    if(err) throw err;
        
    console.log('GET /order/amount : ', rows);
    res.send(rows);
  })
})


router.post('/', (req, res) => {
  let price = 0; //총액
  let {sCustomer, sProduct, date, cellphone, telephone, address, addressDetail, postcode, comment, orderDate} = req.body;
	
	sProduct.map((e, i) => {
    price += e.quantity * e.price; // 수량 * 출고 가격
  })

  connection.query(`INSERT INTO \`order\` (\`customer_id\`, \`date\`, \`price\`, \`telephone\`, \`cellphone\`, \`address\`, \`address_detail\`, \`postcode\`, \`comment\`, \`orderDate\`, \`user_id\`) VALUES ('${sCustomer}', '${date}', '${price}', '${telephone}', '${cellphone}', '${address}', '${addressDetail}', '${postcode}', '${comment}', '${orderDate}', '${req.user.id}')`, function(err, rows) {
    if(err) throw err;
    console.log('POST /order : ' + rows);

    let order_id = rows.insertId;
    sProduct.map((e, i) => {
      connection.query(`INSERT INTO order_product (\`order_id\`, \`product_id\`, \`plant_id\`, \`stock_id\`, \`quantity\`, \`price\`, \`tax\`) VALUES ('${order_id}', '${e.id}', '${e.plant}', '${e.stock}', '${e.quantity}', '${sProduct[i].price * sProduct[i].quantity}', ${e.tax})`, function(err_, rows_) {
        if(err) throw err_;
				console.log('product '+i+' : '+rows_);
      });
    });
    res.send(rows);
  });
});

router.get('/detail/:id', checkAuthed, function(req, res){
  let {id} = req.params; // id로 검색

  connection.query(`SELECT o.id as id, date, name, o.address as address, o.address_detail as addressDetail, o.postcode as postcode, o.telephone as telephone, o.cellphone as cellphone, comment, state, o.user_id from \`order\` as o JOIN \`customer\` as c ON o.customer_id = c.id WHERE o.id=${id}`, function(err, rows) {
    if(err) throw err;
    if(rows.length === 0 || rows[0]['user_id'] !== req.user.id) {
      res.status(400).send({message: '400 Error'});
      return ;
    }
		connection.query(`SELECT p.id AS productId, pl.name as plant, pl.id as plantId, pl.set as plantSet, op.id AS orderProductId, op.stock_id AS stockId, op.quantity, p.name, op.price, op.tax, op.refund from \`order\` as o
		JOIN \`order_product\` as op ON o.id = op.order_id
		JOIN plant as pl ON op.plant_id = pl.id
		JOIN product as p ON op.product_id = p.id
		WHERE o.id=${id}`, function(err, rows2) {
      if(err) throw err;

      //console.log('GET /orderDetail/' + id + ' : ' + rows2);
      //rows2[0]['price_shipping'] = rows2[0].price/rows2[0].quantity;
      res.send({orderInfo: rows, productInfo: rows2});
    });
  });

  /*connection.query(`SELECT \`customer_id\`, \'state\', \`received\`, c.\`name\` as \`customer_name\`, o.\`price\` as \`sum\`, \`date\`, \`product_id\` from \`order\` as o JOIN \`customer\` as c ON o.customer_id = c.id JOIN \`order_product\` as op ON op.order_id = o.id WHERE o.id=${id}`, function(err, rows) {
    if(err) throw err;

    console.log('GET /orderDetail' + id + ' : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });*/
});

router.put('/detail/refund/:id', checkAuthed, function(req, res) {
  let {id} = req.params;

  connection.query(`UPDATE \`order_product\` SET \`refund\`=
    CASE
      WHEN refund=1 THEN 0
      ELSE 1
    END
    WHERE id = ${id}`, function(err, rows){
    if(err) throw err;

    console.log(`PUT /orderDetail/refund/${id}`);
    res.send(rows);
  })
})

router.post('/changeState/', checkAuthed, function(req, res) {
  let {prev, next} = req.body;
	if(prev === 'order' && next === 'shipping') {
		console.log('상품 출하');
		Stock.convertStockByOrder(req.user, req.body, (err, msg) => {
      if(err) throw err;
      // res.status(200).send(msg);
		})
	}
	if(prev == 'shipping' && next === 'order') {
		console.log('상품 출하 취소');
		// Stock.convertStockByOrderReverse(req.user, req.body, (err, msg) => {
		// 	if(err) throw err;
		// })
	}

	if(next == 'complete') {
		//수금
	}

	if(prev == 'complete') {
		//수금 취소
	}

  // connection.query(`UPDATE \`order\` SET \`state\`='${next}' WHERE \`id\`=${id}`, function(err, rows) {
  //   if(err) throw err;
  //   console.log(`PUT /order/changeState/`, rows);
  //   res.send(rows);
  // });
});

router.put('/modify/:id', checkAuthed, function(req, res) {
  let {id} = req.params;
	let {orderInfo, productInfo} = req.body;
	console.warn(req.body)
  orderInfo = orderInfo[0];
  let price = 0;

  productInfo.map((e, i) => {
    price += e.quantity * e['price_shipping']; // 수량 * 출고 가격
	});

	//유저 일치 확인
  connection.query(`SELECT user_id FROM \`order\` WHERE \`id\`=${id}`, function(err, rows) {
    if(err) throw err;
    if(rows[0]['user_id'] !== req.user.id) {
      res.send({message: 'Auth Error'});
      return ;
    }
	})
	
  connection.query(`UPDATE \`order\` SET \`cellphone\`='${orderInfo.cellphone}', \`telephone\`='${orderInfo.telephone}', \`address\`='${orderInfo.address}', \`comment\`='${orderInfo.comment}', \`address\` = '${orderInfo.address}', \`address_detail\` = '${orderInfo.addressDetail}', \`postcode\` = '${orderInfo.postcode}', \`price\`=${price} WHERE \`id\`=${id}`, function(err, rows) {
    if(err) throw err;

    connection.query('DELETE FROM order_product WHERE \`order_id\`='+id, function (e, r) {
      productInfo.map((e, i) => {
        connection.query(`INSERT INTO order_product (\`order_id\`, \`product_id\`, \`plant_id\`, \`quantity\`, \`price\`, \`tax\`) VALUES ('${id}', '${e.productId}', '${e.plantId}', '${e.quantity}', '${e.price}', ${e.tax})`, function(err_, rows_) {
          if(err) throw err_;
          console.log('product '+i+' : ', rows_);
				})
      });
    });

    console.log('PUT /order/modify/', id);
    res.send(rows);
  });
});

module.exports = router;