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


module.exports.getTotal = async (user, data, callback) => {
  try {
    const query = 
    `SELECT count(*) as total
    FROM customer as A JOIN users as B ON A.user_id = B.id
    WHERE \`set\`=1
    AND B.id = '${req.user.id}'
    ${name !== '' ? `AND A.name like '%${name}%'` : ``}`;

    const [rows, field] = await pool.query(query);
    console.log('getTotal');
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getTotal error',error);
  }
}