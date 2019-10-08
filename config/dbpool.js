const mysql = require('mysql');
const poolConfig = require('./database').pool;

const pool = mysql.createPool(poolConfig);

exports.pool = pool;
