'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.getList = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `SELECT * from plant
									WHERE user_id = ?
									AND \`set\`=1`;

    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}