'use strict';

const pool = require('../../config/dbpool').pool;

//월별 성과에서 품목별 성과 주기
module.exports.getProductResult = (user, date, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT P.name, SUM(OP.quantity) as quantity, SUM(OP.price) as price FROM \`order_product\` as OP 
    JOIN \`order\` as O ON O.id = OP.order_id
    JOIN \`product\` as P ON P.id = OP.product_id
    WHERE (O.state = 'shipping' OR O.state = 'complete')
    AND O.user_id = ${user.id}
    AND YEAR(O.date) = ${date.year}
    AND MONTH(O.date) = ${date.month}
    GROUP BY OP.product_id`;
    const exec = conn.query(query, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}
  