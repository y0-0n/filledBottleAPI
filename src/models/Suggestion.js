'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.getSuggestion = (data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      conn.release();
      throw err;
    }

    const query = 'SELECT S.`id`, S.`title`, S.`content`, S.`created_date`, S.`answer`, U.`name` FROM suggestion as S JOIN users as U ON S.user_id = U.id WHERE user_id = ?';
    const exec = conn.query(query, data, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};

module.exports.addSuggestion = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      conn.release();
      throw err;
    }
    console.log(user, data)
    const query = 'INSERT INTO suggestion SET title = ?, content = ?, user_id = ?';
    const exec = conn.query(query, [data.title, data.content, user], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};