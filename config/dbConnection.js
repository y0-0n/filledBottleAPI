var mysql      = require('mysql');
var connConfig   = require('./database.js').conn;

var connection = mysql.createConnection(connConfig);

exports.connection = connection;
