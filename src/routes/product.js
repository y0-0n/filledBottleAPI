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

router.get('/product/search/:keyword', function(req, res){
  let {keyword} = req.params; // 검색어로 검색
  connection.query(`SELECT * from product WHERE name = "${keyword}"`, function(err, rows) {
    if(err) throw err;
    console.log('GET /product/search : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.get('/product/:id', function(req, res){
  let id = req.params.id; // id로 검색

  connection.query('SELECT * from product WHERE id = "'+id+'"', function(err, rows) {
    if(err) throw err;

    console.log('GET /product/'+id+' : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.post('/product', (req, res) => {
  let {name, price} = req.body;
  connection.query(`INSERT INTO \`product\` (\`name\`, \`image\`, \`group\`, \`barcode\`, \`price_receiving\`, \`price_shipping\`, \`category\`, \`is_set\`, \`process\`) VALUES ('${name}', '2', '3', '4', '5', '${price}', '7', '8', '9');`, function(err, rows) {
    if(err) throw err;

    console.log('POST /product : ' + rows);

    const product_id = rows.insertId;
    
    connection.query("SELECT * FROM plant", function(err_, rows_) {
      let plant_ids = [];
      if(err) throw err;
      rows_.map((e, i) => {
        plant_ids.push(e.id);
      });

      plant_ids.map((e, i) => {
        connection.query(`INSERT INTO stock (\`product_id\`, \`plant_id\`, \`quantity\`) VALUES ('${product_id}', '${e}', '${0}')`, function(err_, rows_) {
          if(err_) throw err_;
          console.log('stock '+rows_)
        });
      })
      
  
      res.header("Access-Control-Allow-Origin", "*");
  
      res.send(rows);  
    })
  });
});

router.options('/product', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

router.delete('/product', function(req, res){
  connection.query(`DELETE FROM product WHERE \`id\`=${req.body.id};`, function(err, rows) {
    if(err) throw err;

    console.log('DELETE /product : ' + rows);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(rows);
  });
});

module.exports = router;