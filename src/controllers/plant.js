'use strict';

const express = require('express');
const router = express.Router();
const connection = require('../../config/dbConnection').connection;

router.get('/plant', function(req, res){
  connection.query('SELECT * from plant', function(err, rows) {
    if(err) throw err;

    console.log('GET /plant : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.get('/plant/:id', function(req, res){
  var id = req.params.id; // 공장 이름

  connection.query('SELECT * from plant WHERE id = "'+id+'"', function(err, rows) {
    if(err) throw err;

    console.log('GET /plant/'+id+' : ' + rows);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(rows);
  });
});

router.post('/plant', (req, res) => { //영헌) model에 같은 역할 하는 function 있음
  connection.query("INSERT INTO `plant` (`name`, `division`, `additional_company`, `set`) VALUES ('"+req.body.name+"','1','2','3');", function(err, rows) {
    if(err) throw err;

    console.log('POST /plant : ' + rows); 
    res.header("Access-Control-Allow-Origin", "*");

    res.send(rows);
  });
});

router.options('/plant', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

router.delete('/plant', function(req, res){
  connection.query("DELETE FROM plant WHERE  `id`="+req.body.id+";", function(err, rows) {
    if(err) throw err;

    console.log('DELETE /plant : ' + rows);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.send(rows);
  });
});

module.exports = router;