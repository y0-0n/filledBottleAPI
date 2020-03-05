'use strict';

const pool = require('../../config/dbpool').pool;


module.exports.getList = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `SELECT * from product
									WHERE user_id = ?
									AND \`set\`=1`;

    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}

module.exports.getAllFamily = (data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT F.name, F.id FROM productFamily as F WHERE F.category = ${data}`;
    const exec = conn.query(query, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

module.exports.getFamilyCategory = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT * FROM familyCategory`;
    const exec = conn.query(query, (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

//회원이 취급하는 대분류 리스트 주기
module.exports.getUserFamilyCategory = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT FC.* FROM familyCategory AS FC
		JOIN productFamily AS PF ON FC.id = PF.category
		JOIN productFamily_user AS PFU ON PFU.family_id = PF.id
		WHERE PFU.user_id = ?
		GROUP BY FC.id`;
    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}

//회원이 취급하는 품목 리스트 주기
module.exports.getFamilyList = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT F.name, F.id
		FROM productFamily as F JOIN productFamily_user as FU ON F.id = FU.family_id
		JOIN familyCategory as FC ON FC.id = F.category
		JOIN users as U ON FU.user_id = U.id
		WHERE U.id = ?
		AND F.category = ?
		`;
    const exec = conn.query(query, [user.id, data.categoryId], (err, result) => {
      conn.release();
      console.warn('실행 sql : ', exec.sql);
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
    const query = `INSERT INTO productFamily (\`name\`, \`user_id\`) VALUES ('${data.newFamily}', ?)`;
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
    const query = `INSERT INTO productFamily (\`name\`, \`user_id\`) VALUES (${data.newFamily}, ?)`;
    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      return callback(err, result);
    });
  });
}