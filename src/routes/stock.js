'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;

router.get('/stock', function(req, res){
  connection.query('SELECT quantity, s.id as id, weight, name, grade from stock as s JOIN product as p ON s.product_id = p.id', function(err, rows) {
    if(err) throw err;

    console.log('GET /stock : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows); 
  });
});

router.put('/stock/:id', function(req, res){
  let {quantity} = req.body;
  let {id} = req.params;
  connection.query(`UPDATE \`stock\` SET \`quantity\`='${quantity}' WHERE \`id\`=${id}`, function(err, row) {
    if(err) throw err;

    console.log('PUT /stock : ' + row);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(row); 
  });
})

router.options('/stock', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

router.options('/stock/:id', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

module.exports = router;