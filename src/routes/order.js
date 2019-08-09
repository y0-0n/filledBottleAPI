'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;

router.get('/order', function(req, res){
  connection.query('SELECT * from order', function(err, rows) {
    if(err) throw err;

    console.log('GET /order : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.post('/order', (req, res) => {
  let products = req.body.sProduct;
  let prices = []; //각 제품들의 가격
  let price = 0; //총액
  products.map((e, i) => {
    price += e.c * e.d; // 수량 * 출고 가격
    prices.push(e.c * e.d);
  })
  connection.query(`INSERT INTO \`order\` (\`customer_id\`, \`employee_id\`, \`date\`, \`price\`) VALUES ('${req.body.sCustomer}', '1', '${req.body.date}', '${price}')`, function(err, rows) {
    if(err) throw err;
    console.log('POST /order : ' + rows);

    let order_id = rows.insertId;
    products.map((e, i) => {
      connection.query(`INSERT INTO order_product (\`order_id\`, \`product_id\`, \`quantity\`, \`price\`) VALUES ('${order_id}', '${e.a}', '${e.c}', '${prices[i]}')`, function(err_, rows_) {
        if(err) throw err_;
        console.log('product '+i+' : '+rows_);
      })
    });
    res.header("Access-Control-Allow-Origin", "*");

    res.send(rows);
  });
});

router.options('/order', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

router.delete('/customer', function(req, res){
  connection.query("DELETE FROM customer WHERE  `id`="+req.body.id+";", function(err, rows) {
    if(err) throw err;

    console.log('DELETE /customer : ' + rows);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(rows);
  });
});

module.exports = router;