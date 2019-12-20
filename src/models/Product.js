'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.getFamilyList = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT F.name
    FROM product_family as F JOIN users as U ON F.user_id = U.id
    WHERE U.id = ?`;
    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

module.exports.addFamily = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `INSERT INTO product_family (\`name\`, \`user_id\`) VALUES ('${data.newFamily}', ?)`;
    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

module.exports.removeFamily = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `INSERT INTO product_family (\`name\`, \`user_id\`) VALUES (${data.newFamily}, ?)`;
    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}