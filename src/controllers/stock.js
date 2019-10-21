'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;

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
  connection.query(`SELECT quantity, s.id as id, weight, p.name, grade
                    FROM stock as s JOIN product as p JOIN users as u ON s.product_id = p.id AND u.id = p.user_id
                    WHERE p.\`set\`=1
                    AND u.id = '${req.user.id}'`, function(err, rows) {
    if(err) throw err;

    console.log('GET /stock : ' + rows);
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "http://cosimo.iptime.org:3000");
    res.send(rows); 
  });
});

router.put('/', function(req, res){
  let {quantity, id} = req.body;
  connection.query(`UPDATE \`stock\` SET \`quantity\`='${quantity}' WHERE \`id\`=${id}`, function(err, row) {
    if(err) throw err;

    console.log('PUT /stock : ' + row);
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "http://cosimo.iptime.org:3000");
    res.send(row); 
  });
})

router.options('/', (req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Origin", "http://cosimo.iptime.org:3000");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

module.exports = router;