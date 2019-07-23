var mysql      = require('mysql');
var dbconfig   = require('./database.js').dev;

var connection = mysql.createConnection(dbconfig);

exports.connection = connection;