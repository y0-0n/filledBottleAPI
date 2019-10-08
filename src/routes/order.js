'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;

router.get('/order/total/:state/:name', function(req, res){
  let {state, name} = req.params;
  console.log(state)
  let sql = `SELECT count(*) as total
             from \`order\` as A JOIN \`customer\` AS B ON A.customer_id = B.id
             ${(state !== 'all' || name !== 'a' ? 'WHERE ' : '')}
             ${(state !== 'all' ? `A.state = '${state}'` : '')}
             ${(state !== 'all' && name !== 'a' ? 'AND' : '')}
             ${(name !== 'a' ? `B.name = '${name}'`: '')}`
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /order/total/:state : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.get('/order/:page/:state/:name', function(req, res){
  let {state, page, name} = req.params; // 상태로 검색
  let sql = `SELECT A.id, A.state, A.date, A.price, A.received, B.name, A.orderDate
             from \`order\` AS A JOIN \`customer\` AS B ON A.customer_id = B.id
             ${(state !== 'all' || name !== 'a' ? 'WHERE ' : '')}
             ${(state !== 'all' ? `A.state = '${state}'` : '')}
             ${(state !== 'all' && name !== 'a' ? 'AND' : '')}
             ${(name !== 'a' ? `B.name = '${name}'`: '')}
             ORDER BY A.orderDate DESC LIMIT ${5*(page-1)}, 5`;
  console.log(state, page, state !== 'all' || name !== '')
  connection.query(sql, function(err, rows) {
    if(err) throw err;

    console.log('GET /order/'+page+'/'+state+' : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.get('/order_product', function(req, res) {
  connection.query('SELECT * from order_product', function(err, rows) {
    if(err) throw err;

    console.log('GET /order_product : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  })
});

router.get('/order_summary', function(req, res) {
  connection.query('SELECT * from `order` as A JOIN `order_product` as B ON A.id = B.order_id', function(err, rows) {
    if(err) throw err;

    console.log('GET /order_summary : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  })
});

router.post('/order', (req, res) => {
  let price = 0; //총액
  let {sCustomer, sProduct, date, cellphone, telephone, address, comment, orderDate} = req.body;
  sProduct.map((e, i) => {
    price += e.quantity * e.price; // 수량 * 출고 가격
  })

  connection.query(`INSERT INTO \`order\` (\`customer_id\`, \`date\`, \`price\`, \`telephone\`, \`cellphone\`, \`address\`, \`comment\`, \`orderDate\`) VALUES ('${sCustomer}', '${date}', '${price}', '${telephone}', '${cellphone}', '${address}', '${comment}', '${orderDate}')`, function(err, rows) {
    if(err) throw err;
    console.log('POST /order : ' + rows);

    let order_id = rows.insertId;
    sProduct.map((e, i) => {
      connection.query(`INSERT INTO order_product (\`order_id\`, \`product_id\`, \`quantity\`, \`price\`, \`tax\`) VALUES ('${order_id}', '${e.id}', '${e.quantity}', '${sProduct[i].price * sProduct[i].quantity}', ${e.tax})`, function(err_, rows_) {
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

router.get('/orderDetail/:id', function(req, res){
  let {id} = req.params; // id로 검색

  connection.query(`SELECT date, name, o.address as address, o.telephone as telephone, o.cellphone as cellphone, comment, state from \`order\` as o JOIN \`customer\` as c ON o.customer_id = c.id WHERE o.id=${id}`, function(err, rows) {
    if(err) throw err;

    connection.query(`SELECT * from \`order\` as o JOIN \`order_product\` as op ON o.id = op.order_id JOIN product as p ON op.product_id = p.id WHERE o.id=${id}`, function(err, rows2) {
      if(err) throw err;

      console.log('GET /orderDetail/' + id + ' : ' + rows);
      res.header("Access-Control-Allow-Origin", "*");
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

router.put('/order/changeState/:id/:state', function(req, res) {
  let {id, state} = req.params;

  connection.query(`UPDATE \`order\` SET \`state\`='${state}' WHERE \`id\`=${id}`, function(err, rows) {
    if(err) throw err;

    console.log(`PUT /order/changeState/${id}/${state}` + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.put('/order/modify/:id', function(req, res) {
  let {id} = req.params;
  let {orderInfo, productInfo} = req.body;
  orderInfo = orderInfo[0];
  let price = 0;
  console.log(productInfo)
  productInfo.map((e, i) => {
    price += e.quantity * e['price_shipping']; // 수량 * 출고 가격
  });

  connection.query(`UPDATE \`order\` SET \`cellphone\`='${orderInfo.cellphone}', \`telephone\`='${orderInfo.telephone}', \`address\`='${orderInfo.address}', \`comment\`='${orderInfo.comment}', \`price\`=${price} WHERE \`id\`=${id}`, function(err, rows) {
    if(err) throw err;

    connection.query('DELETE FROM order_product WHERE \`order_id\`='+id);

    productInfo.map((e, i) => {  
      connection.query(`INSERT INTO order_product (\`order_id\`, \`product_id\`, \`quantity\`, \`price\`, \`tax\`) VALUES ('${id}', '${e.id}', '${e.quantity}', '${e.price}', ${e.tax})`, function(err_, rows_) {
        if(err) throw err_;
        console.log('product '+i+' : '+rows_);
      })
    });

    console.log('PUT /order/modify/'+id);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.options('/order/modify/:id', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

router.options('/order/changeState/:id/:state', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

module.exports = router;