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
		let {email, crNumber, password, name, address, postcode, phone, salt} = data;

    const query = `INSERT INTO users SET email = ?, crNumber = ?, password = ?, name = ?, address = ?, postcode = ?, phone = ?, salt =  ?`;
    const exec = conn.query(query, [email, crNumber, password, name, address, postcode, phone, salt], (err, result) => {
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
      conn.release();
      throw err;
    }

    const query = 'SELECT password, salt, id FROM users WHERE email = ?';
    const exec = conn.query(query, email, (err, rows) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, rows);
    });
  });
};

module.exports.getInfo = (id, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }

    const query = 'SELECT email, name, address, phone, crNumber FROM users WHERE id = ?';
    const exec = conn.query(query, id, (err, rows) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, rows);
    });
  });
}

module.exports.updateInfo = (id, data, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }

    const query = `UPDATE users SET name = '${data.name}', address = '${data.address}', phone = '${data.phone}' WHERE id = ?`;
    const exec = conn.query(query, id, (err, rows) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, rows);
    });
  });
}
