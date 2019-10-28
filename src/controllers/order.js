'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;

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

router.get('/total/:state/:name', checkAuthed, function(req, res) {
  let {state, name} = req.params;
  let sql = `SELECT count(*) as total
             from \`order\` as A JOIN \`customer\` AS B JOIN \`users\` AS C ON A.customer_id = B.id AND A.user_id = C.id
             WHERE C.id='${req.user.id}'
             ${(state !== 'all' ? `AND A.state = '${state}'` : '')}
             ${(name !== 'a' ? `AND B.name = '${name}'`: '')}`
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /order/total/:state : ' + rows);
    res.send(rows);
  });
});

router.get('/:page/:state/:name', checkAuthed, function(req, res){
  let {state, page, name} = req.params; // 상태로 검색
  let sql = `SELECT A.id, A.state, A.date, A.price, A.received, B.name, A.orderDate, B.set
             from \`order\` AS A JOIN \`customer\` AS B JOIN \`users\` as C ON A.customer_id = B.id AND A.user_id = C.id
             WHERE C.id='${req.user.id}'
             ${(state !== 'all' ? `AND A.state = '${state}'` : '')}
             ${(name !== 'a' ? `AND B.name = '${name}'`: '')}
             ORDER BY A.orderDate DESC
             ${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}`;
  //console.log(state, page, state !== 'all' || name !== '')
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

router.post('/', (req, res) => {
  let price = 0; //총액
  let {sCustomer, sProduct, date, cellphone, telephone, address, comment, orderDate} = req.body;
  
  sProduct.map((e, i) => {
    price += e.quantity * e.price; // 수량 * 출고 가격
  })

  connection.query(`INSERT INTO \`order\` (\`customer_id\`, \`date\`, \`price\`, \`telephone\`, \`cellphone\`, \`address\`, \`comment\`, \`orderDate\`, \`user_id\`) VALUES ('${sCustomer}', '${date}', '${price}', '${telephone}', '${cellphone}', '${address}', '${comment}', '${orderDate}', '${req.user.id}')`, function(err, rows) {
    if(err) throw err;
    console.log('POST /order : ' + rows);

    let order_id = rows.insertId;
    sProduct.map((e, i) => {
      connection.query(`INSERT INTO order_product (\`order_id\`, \`product_id\`, \`quantity\`, \`price\`, \`tax\`) VALUES ('${order_id}', '${e.id}', '${e.quantity}', '${sProduct[i].price * sProduct[i].quantity}', ${e.tax})`, function(err_, rows_) {
        if(err) throw err_;
        console.log('product '+i+' : '+rows_);
      })
    });
    res.send(rows);
  });
});

router.get('/orderDetail/:id', checkAuthed, function(req, res){
  let {id} = req.params; // id로 검색

  connection.query(`SELECT date, name, o.address as address, o.telephone as telephone, o.cellphone as cellphone, comment, state, o.user_id from \`order\` as o JOIN \`customer\` as c ON o.customer_id = c.id WHERE o.id=${id}`, function(err, rows) {
    if(err) throw err;
    if(rows.length === 0 || rows[0]['user_id'] !== req.user.id) {
      res.status(400).send({message: '400 Error'});
      return ;
    }
    connection.query(`SELECT p.id AS productId, op.id AS orderProductId, op.quantity, p.name, op.price, op.tax, op.refund from \`order\` as o JOIN \`order_product\` as op ON o.id = op.order_id JOIN product as p ON op.product_id = p.id WHERE o.id=${id}`, function(err, rows2) {
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

router.put('/orderDetail/refund/:id', checkAuthed, function(req, res) {
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

router.put('/changeState/:id/:state', checkAuthed, function(req, res) {
  let {id, state} = req.params;

  connection.query(`UPDATE \`order\` SET \`state\`='${state}' WHERE \`id\`=${id}`, function(err, rows) {
    if(err) throw err;

    console.log(`PUT /order/changeState/${id}/${state}` + rows);
    res.send(rows);
  });
});

router.put('/modify/:id', checkAuthed, function(req, res) {
  let {id} = req.params;
  let {orderInfo, productInfo} = req.body;
  orderInfo = orderInfo[0];
  let price = 0;

  productInfo.map((e, i) => {
    price += e.quantity * e['price_shipping']; // 수량 * 출고 가격
  });
  connection.query(`SELECT user_id FROM \`order\` WHERE \`id\`=${id}`, function(err, rows) {
    if(err) throw err;

    if(rows[0]['user_id'] !== req.user.id) {
      res.send({message: 'Auth Error'});
      return ;
    }
  })
  connection.query(`UPDATE \`order\` SET \`cellphone\`='${orderInfo.cellphone}', \`telephone\`='${orderInfo.telephone}', \`address\`='${orderInfo.address}', \`comment\`='${orderInfo.comment}', \`price\`=${price} WHERE \`id\`=${id}`, function(err, rows) {
    if(err) throw err;

    connection.query('DELETE FROM order_product WHERE \`order_id\`='+id, function (e, r) {
      productInfo.map((e, i) => {
        connection.query(`INSERT INTO order_product (\`order_id\`, \`product_id\`, \`quantity\`, \`price\`, \`tax\`) VALUES ('${id}', '${e.productId}', '${e.quantity}', '${e.price}', ${e.tax})`, function(err_, rows_) {
          if(err) throw err_;
          console.log('product '+i+' : '+rows_);
        })
      });
    });

    console.log('PUT /order/modify/'+id);
    res.send(rows);
  });
});

module.exports = router;