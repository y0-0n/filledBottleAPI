'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;

router.get('/product', function(req, res){
  connection.query('SELECT * from product', function(err, rows) {
    if(err) throw err;

    console.log('GET /product : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.get('/product/:id', function(req, res){
  var id = req.params.id; // 제품 이름

  connection.query('SELECT * from product WHERE id = "'+id+'"', function(err, rows) {
    if(err) throw err;

    console.log('GET /product/'+id+' : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.post('/product', (req, res) => {
  connection.query("INSERT INTO `product` (`name`, `image`, `group`, `barcode`, `productcol`, `price_receiving`, `price_shipping`, `category`, `is_set`, `process`) VALUES ('"+req.body.name+"', '2', '3', '4', '5', '6', '7', '8', '9', '10');", function(err, rows) {
    if(err) throw err;

    console.log('POST /product : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");

    res.send(rows);
  });
});

router.options('/product', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

router.delete('/product', function(req, res){
  connection.query("DELETE FROM product WHERE  `id`="+req.body.id+";", function(err, rows) {
    if(err) throw err;

    console.log('DELETE /product : ' + rows);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(rows);
  });
});

module.exports = router;