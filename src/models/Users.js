'use strict';

const pool = require('../../config/dbpool').pool;

/**
 * 회원 가입
 * @param query
 * @param data
 * @param callback
 */

module.exports.addUser = (data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      conn.release();
      throw err;
    }

    const query = 'INSERT INTO users SET ? ';
    const exec = conn.query(query, data, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};

/**
 * 이메일 중복 체크
 * @param email
 * @param callback
 */
module.exports.emailCheck = (email, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      conn.release();
      throw err;
    }

    const query = 'SELECT id FROM users WHERE user_id = ?';
    const exec = conn.query(query, email, (err, rows) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, rows);
    });
  });
};
