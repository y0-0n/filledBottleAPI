'use strict';

const pool = require('../../config/dbpool').pool;

//월별 성과에서 품목별 성과 주기
module.exports.getProductResult = async (user, date, callback) => {
  try{
    const query = `SELECT P.name, SUM(OP.quantity) as quantity, SUM(OP.price) as price FROM \`order_product\` as OP 
      JOIN \`order\` as O ON O.id = OP.order_id
      JOIN \`product\` as P ON P.id = OP.product_id
      WHERE (O.state = 'shipping' OR O.state = 'complete')
      AND O.company_id = ${user.company_id}
      AND YEAR(O.date) = ${date.year}
      AND MONTH(O.date) = ${date.month}
      GROUP BY OP.product_id`;
    const [rows, field] = await pool.query(query);
    console.log('getProductResult');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getProductResult error',error);
  }
}

  