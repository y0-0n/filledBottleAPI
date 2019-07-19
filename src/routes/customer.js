'use strict';

const express = require('express');
const router = express.Router();
var mysql      = require('mysql');
var dbconfig   = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);

router.get('/customer', function(req, res){
    connection.query('SELECT * from customer', function(err, rows) {
        if(err) throw err;
    
        console.log('GET /customer : ' + rows);
        res.send(rows);
    });
});
module.exports = router;