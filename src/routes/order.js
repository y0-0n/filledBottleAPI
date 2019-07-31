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
  res.header("Access-Control-Allow-Origin", "*");

  connection.query("INSERT INTO sell (`customer_id`, `employee_id`, `date`, `price`) VALUES ('"+req.body.sCustomer+"', 1, '"+req.body.date+"', '100')", function(err, rows) {
    if(err) {
      res.send(err);
      throw err;
    }
    console.log('POST /order : ' + rows);
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