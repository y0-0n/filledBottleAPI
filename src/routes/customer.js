'use strict';
const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;
const multer = require('multer');
const upload = require("../modules/fileupload");

router.get('/customer', function(req, res){
  connection.query('SELECT * from customer', function(err, rows) {
    if(err) throw err;

    console.log('GET /customer : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.get('/customer/:id', function(req, res){
  var id = req.params.id; // 거래처 이름

  connection.query('SELECT * from customer WHERE id = "'+id+'"', function(err, rows) {
    if(err) throw err;

    console.log('GET /customer/'+id+' : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.post('/customer', upload.single('file'), (req, res) => {
  let {name, delegate, telephone, cellphone, keyword, set, transfer, address, manager} = req.body;
  let fileName = req.file ? req.file.filename : null;
  connection.query("INSERT INTO customer (`name`, `delegate`, `telephone`, `cellphone`, `keyword`, `set`, `transfer`, `address`, `manager`, `file_name`) VALUES ('"+name+"', '"+delegate+"', '"+telephone+"', '"+cellphone+"', '1', '1', '2', '"+address+"', '"+manager+"', '"+fileName+"')", function(err, rows) {
    if(err) throw err;
    
    console.log('POST /customer : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");

    res.send(rows);
  });
});

router.options('/customer', (req, res, next) => {
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