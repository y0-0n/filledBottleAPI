'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.getQuestionList = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      conn.release();
      throw err;
    }

    const query = `SELECT * FROM survey_content`;
    const exec = conn.query(query, user, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};
