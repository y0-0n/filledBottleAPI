'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;

router.get('/stock', function(req, res){
  connection.query('SELECT * from stock', function(err, rows) {
    if(err) throw err;

    console.log('GET /stock : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows); 
  });
});

router.options('/stock', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

module.exports = router;