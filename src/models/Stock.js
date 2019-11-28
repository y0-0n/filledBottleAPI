'use strict';

const pool = require('../../config/dbpool').pool;

/**
 * 회원 가입
 * @param query
 * @param data
 * @param callback
 */

 //생산 모듈을 통한 재고 변경
module.exports.convertStockByProduce = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    data.sProduct1.forEach(e => {
      const select_query = `SELECT S.* FROM stock as S JOIN product as P ON S.product_id = P.id
      WHERE P.user_id = ?
      AND P.\`set\` = 1
      AND P.id = ${e.id}
      ORDER BY changeDate DESC
      LIMIT 1`;
      const exec = conn.query(select_query, [user.id], (err, result) => {
        console.log('실행 sql : ', exec.sql);
        const current = result[0].quantity
        const change = -e.quantity;
        const insert_query = `INSERT INTO stock (\`product_id\`, \`quantity\`, \`change\`) VALUES (${e.id}, ${current+change}, ${change})`;
        const exec2 = conn.query(insert_query, (err2, result2) => {
          console.log('실행 sql : ', exec2.sql);
        })
      });
    });
    data.sProduct2.forEach(e => {
      const select_query = `SELECT S.* FROM stock as S JOIN product as P ON S.product_id = P.id
      WHERE P.user_id = ?
      AND P.\`set\` = 1
      AND P.id = ${e.id}
      ORDER BY changeDate DESC
      LIMIT 1`;
      const exec = conn.query(select_query, [user.id], (err, result) => {
        console.log('실행 sql : ', exec.sql);
        const current = result[0].quantity
        const change = e.quantity;
        const insert_query = `INSERT INTO stock (\`product_id\`, \`quantity\`, \`change\`) VALUES (${e.id}, ${parseInt(current)+parseInt(change)}, ${change})`;
        const exec2 = conn.query(insert_query, (err2, result2) => {
          conn.release();
          console.log('실행 sql : ', exec2.sql);
          return callback(err2, 'success');
        })
      });
    });
  });
};

module.exports.getStock = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT b.* FROM (SELECT product_id, MAX(changeDate) AS changeDate
    FROM \`en\`.\`stock\` GROUP BY product_id) AS a JOIN
    (SELECT S.quantity, S.id as id, P.weight, P.name, P.grade, S.product_id, S.changeDate FROM \`en\`.\`stock\` AS S JOIN \`en\`.\`product\` AS P ON S.product_id = P.id WHERE P.user_id = ? AND P.\`set\` = 1) AS b
    ON a.product_id = b.product_id AND a.changeDate = b.changeDate;`;
  
    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

module.exports.getStockDetail = (user, product_id, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT P.name as name, S.quantity, S.changeDate as date, S.change FROM \`stock\` AS S JOIN \`product\` as P ON S.product_id = P.id
    WHERE P.id = ?
    AND P.user_id = ?
    ORDER BY \`changeDate\` DESC`;
    const exec = conn.query(query, [product_id, user.id], (err, result) => {
      conn.release();
      console.log(result)
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    })
  })
}
