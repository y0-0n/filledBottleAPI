'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;
const upload = require("../modules/fileUploadProduct");

router.get('/', function(req, res){
  connection.query('SELECT * from product WHERE \`set\`=1', function(err, rows) {
    if(err) throw err;

    console.log('GET /product : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.get('/unset', function(req, res){
  connection.query('SELECT * from product WHERE \`set\`=0', function(err, rows) {
    if(err) throw err;

    console.log('GET /product/unset : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.get('/search/:keyword', function(req, res){
  let {keyword} = req.params; // 검색어로 검색
  connection.query(`SELECT * from product WHERE name = "${keyword}"`, function(err, rows) {
    if(err) throw err;
    console.log('GET /product/search : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.get('/:id', function(req, res) {
  let id = req.params.id; // id로 검색

  connection.query('SELECT * from product WHERE id = "'+id+'"', function(err, rows) {
    if(err) throw err;

    console.log('GET /product/'+id+' : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.put('/', function(req, res){
  connection.query(`UPDATE product SET \`set\`=1 WHERE \`id\`=${req.body.id};`, function(err, rows) {
    if(err) throw err;

    console.log('PUT /product : ' + rows);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(rows);
  });
});

router.post('/', upload.single('file'), (req, res) => {
  let {name, price, grade, weight} = req.body;
  let fileName = req.file ? 'product/'+req.file.filename : '318x180.svg';

  connection.query(`INSERT INTO \`product\` (\`name\`, \`image\`, \`grade\`, \`barcode\`, \`price_receiving\`, \`price_shipping\`, \`weight\`, \`safety_stock\`, \`file_name\`) VALUES ('${name}', '2', '${grade}', '4', '5', '${price}', '${weight}', '8', '${fileName}');`, function(err, rows) {
    if(err) throw err;

    console.log('POST /product : ' + rows);

    const product_id = rows.insertId;
    
    connection.query(`INSERT INTO stock (\`product_id\`, \`quantity\`) VALUES ('${product_id}', '${0}')`, function(err_, rows_) {
      if(err_) throw err_;
      console.log('stock '+rows_);

      res.header("Access-Control-Allow-Origin", "*");
      res.send(rows);
    });
  })
});

router.options('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

router.delete('/', function(req, res){
  connection.query(`UPDATE product SET \`set\`=0 WHERE \`id\`=${req.body.id};`, function(err, rows) {
    if(err) throw err;

    console.log('DELETE /product : ' + rows);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(rows);
  });
});

module.exports = router;