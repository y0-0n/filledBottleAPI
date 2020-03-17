'use strict';

const pool = require('../../config/dbpool').pool;
const Product = require('./Product');

module.exports.getOrder = (user, data, callback) => {
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
