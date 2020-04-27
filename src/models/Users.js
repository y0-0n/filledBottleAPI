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

    const query = 'SELECT password, salt, id, role FROM users WHERE email = ?';
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

module.exports.getListAdmin = (data, callback) => {
	const {page} = data;
	pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }

		const query = `SELECT id, email, crNumber, name, address, phone, created_date FROM users
		ORDER BY created_date DESC
    ${(page !== 'all' ? `LIMIT ${15*(page-1)}, 15` : '')}`;

    const exec = conn.query(query, (err, rows) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, rows);
    });
  });
}

module.exports.getTotalAdmin = (id, callback) => {
	pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }

		const query = `SELECT count(*) as total FROM users`;

    const exec = conn.query(query, id, (err, rows) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, rows);
    });
  });
}

module.exports.getDetailAdmin = (id, data, callback) => {
	pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }

		const query = `SELECT id, email, crNumber, name, address, phone, created_date FROM users WHERE id= ?`;

    const exec = conn.query(query, [data.id], (err, rows) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, rows);
    });
  });
}

module.exports.getProductFamilyAdmin = (id, data, callback) => {
	pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }

		const query = `SELECT PFU.id, PF.name FROM productFamily_user as PFU
		JOIN productFamily as PF ON PF.id = PFU.family_id
		WHERE PFU.user_id = ?`;

    const exec = conn.query(query, [data.id], (err, rows) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, rows);
    });
  });
}