'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.getList = (user, page, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      conn.release();
      throw err;
    }

    const query = `SELECT S.\`id\`, S.\`title\`, S.\`content\`, S.\`created_date\`, S.\`answer\`, U.\`name\`
    FROM suggestion as S JOIN users as U ON S.user_id = U.id
    WHERE user_id = ?
    ORDER BY created_date DESC
    ${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}`;
    const exec = conn.query(query, user, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};

module.exports.getTotal = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      conn.release();
      throw err;
    }

    const query = `SELECT count(*) as total
    FROM suggestion as S JOIN users as U ON S.user_id = U.id
    WHERE user_id = ?`;
    const exec = conn.query(query, user, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};

module.exports.getSuggestionById = (user_id, id, callback) => {

  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }

    const query = 'SELECT S.`id`, S.`title`, S.`content`, S.`created_date`, S.`answer`, U.`name` FROM suggestion as S JOIN users as U ON S.user_id = U.id WHERE U.id = ? AND S.id = ?';
    const exec = conn.query(query, [user_id, id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};

module.exports.addSuggestion = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = 'INSERT INTO suggestion SET title = ?, content = ?, user_id = ?';
    const exec = conn.query(query, [data.title, data.content, user], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};