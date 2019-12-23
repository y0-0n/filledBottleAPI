'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.create = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `INSERT INTO \`produce\` (\`user_id\`, \`weather\`, \`rain\`, \`snow\`, \`temperatures\`, \`min_temp\`, \`max_temp\`, \`product_id\`, \`process\`, \`name\`, \`content\`, \`area\`, \`expected_output\`)
                    VALUES (?, '${data.weather}', ${data.rain}, ${data.snow}, ${data.temperatures}, ${data.minTemp}, ${data.maxTemp}, ?, '${data.process}', '${data.name}', '${data.content}', ${data.area}, ${data.expected});`;
    const exec = conn.query(query, [user.id, data.product_id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};

module.exports.getTotal = (user, name, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT count(*) as total
                  FROM produce as P JOIN users as U ON P.user_id = U.id
                  JOIN product as Pt ON P.product_id = Pt.id
                  WHERE P.user_id = ?
                  ${name !== 'a' ? `AND Pt.name = '${name}'` : ``}`;

    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};

module.exports.getList = (user, page, name, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT P.created_date, Pt.name as productName, Pt.id, P.name
    FROM produce as P JOIN users as U ON P.user_id = U.id
    JOIN product as Pt ON Pt.id = P.product_id
    WHERE P.user_id = ?
    ${name !== 'a' ? `AND Pt.name = '${name}'` : ``}
    ORDER BY created_date DESC
    ${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}`;

    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};
