'use strict';

const pool = require('../../config/dbpool').pool;
const Product = require('./Product');

module.exports.getOrder = async (user, data, callback) => {
  try{
    const query = 
    `SELECT P.\`name\`, SUM(OP.quantity) as quantity, SUM(OP.price) as sum FROM customer AS C
			JOIN \`order\` AS O ON C.id = O.customer_id
			JOIN order_product AS OP ON OP.order_id = O.id
			JOIN product AS P ON OP.product_id = P.id
			WHERE C.user_id = ?
			AND O.customer_id = ${data.customer}
			GROUP BY P.id
		`;
    const [rows, field] = await pool.query(query, [user.id]);
    console.log('getOrder');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getOrder error',error);
  }
}

module.exports.getOrder1 = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `SELECT P.\`name\`, SUM(OP.quantity) as quantity, SUM(OP.price) as sum FROM customer AS C
			JOIN \`order\` AS O ON C.id = O.customer_id
			JOIN order_product AS OP ON OP.order_id = O.id
			JOIN product AS P ON OP.product_id = P.id
			WHERE C.user_id = ?
			AND O.customer_id = ${data.customer}
			GROUP BY P.id
		`;

    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}
