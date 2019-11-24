'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;
const upload = require("../modules/fileUploadProduct");

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

router.get('/', checkAuthed, function(req, res){
  connection.query(`SELECT A.id as id, A.\`name\` as name, A.grade, A.price_shipping, weight, file_name
                    FROM product as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=1
                    AND B.id = '${req.user.id}'`, function(err, rows) {
    if(err) throw err;

    console.log('GET /product : ' + rows);
    res.send(rows);
  });
});

router.get('/unset', checkAuthed, function(req, res){
  connection.query(`SELECT A.id as id, A.\`name\` as name, A.grade, A.price_shipping, weight, file_name
                    FROM product as A JOIN users as B ON A.user_id = B.id
                    WHERE \`set\`=0
                    AND B.id = '${req.user.id}'`, function(err, rows) {
    if(err) throw err;

    console.log('GET /product/unset : ' + rows);
    res.send(rows);
  });
});

router.get('/search/:keyword', checkAuthed, function(req, res){
  let {keyword} = req.params; // 검색어로 검색
  connection.query(`SELECT * from product
    WHERE name = "${keyword}"
    AND \`set\` = 1`, function(err, rows) {
    if(err) throw err;
    console.log('GET /product/search : ' + rows);

    res.send(rows);
  });
});

router.get('/:id', checkAuthed, function(req, res) {
  let id = req.params.id; // id로 검색

  connection.query('SELECT * from product WHERE id = "'+id+'"', function(err, rows) {
    if(err) throw err;

    console.log('GET /product/'+id+' : ' + rows);
    res.send(rows);
  });
});

router.put('/', checkAuthed, function(req, res){
  connection.query(`UPDATE product SET \`set\`=1 WHERE \`id\`=${req.body.id};`, function(err, rows) {
    if(err) throw err;

    console.log('PUT /product : ' + rows);

    res.send(rows);
  });
});

router.post('/', checkAuthed, upload.single('file'), (req, res) => {
  let {name, price, grade, weight} = req.body;
  let fileName = req.file ? 'product/'+req.file.filename : '318x180.svg';

  connection.query(`INSERT INTO \`product\` (\`name\`, \`grade\`, \`barcode\`, \`price_receiving\`, \`price_shipping\`, \`weight\`, \`safety_stock\`, \`file_name\`, \`user_id\`)
                    VALUES ('${name}', '${grade}', '4', '5', '${price}', '${weight}', '8', '${fileName}', "${req.user.id}");`, function(err, rows) {
    if(err) throw err;

    console.log('POST /product : ' + rows);

    const product_id = rows.insertId;
    
    connection.query(`INSERT INTO stock (\`product_id\`, \`quantity\`) VALUES ('${product_id}', '${0}')`, function(err_, rows_) {
      if(err_) throw err_;
      console.log('stock '+rows_);

      res.send(rows);
    });
  })
});

router.delete('/', checkAuthed, function(req, res){
  connection.query(`UPDATE product SET \`set\`=0 WHERE \`id\`=${req.body.id};`, function(err, rows) {
    if(err) throw err;

    console.log('DELETE /product : ' + rows);
    res.send(rows);
  });
});

module.exports = router;