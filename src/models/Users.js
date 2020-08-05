'use strict';

const pool = require('../../config/dbpool').pool;

/**
 * 회원 가입
 * @param query
 * @param data
 * @param callback
 */
module.exports.addUser = async (data, callback) => {
  try{
    let {email, crNumber, password, name, address, addressDetail, postcode, phone, salt, accountName, accountNumber} = data;

    const query = 
    `INSERT INTO users SET email = ?, crNumber = ?, password = ?, name = ?, address = ?, address_detail = ?, postcode = ?, phone = ?, salt =  ?, accountName = ?, accountNumber = ?`;
    const [rows, field] = await pool.query(
      query, [email, crNumber, password, name, address, addressDetail, postcode, phone, salt, accountName, accountNumber]);    
    console.log('addUser')
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('addUser error',error)
  }
};

module.exports.addUser1 = (data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      console.log(err);
      conn.release();
      throw err;
		}
		let {email, crNumber, password, name, address, addressDetail, postcode, phone, salt, accountName, accountNumber} = data;

    const query = `INSERT INTO users SET email = ?, crNumber = ?, password = ?, name = ?, address = ?, address_detail = ?, postcode = ?, phone = ?, salt =  ?, accountName = ?, accountNumber = ?`;
    const exec = conn.query(query, [email, crNumber, password, name, address, addressDetail, postcode, phone, salt, accountName, accountNumber], (err, result) => {
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
module.exports.emailCheck = async (email, callback) => {
  try{
    const query = 'SELECT password, salt, id, role FROM users WHERE email = ?';
  
    const [rows, field] = await pool.query(query,email);
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('emailCheck error!',error);
    return callback(error, []);
  }
  
};


module.exports.getInfo = async (id, callback) => {
  try{
    const query = 'SELECT email, name, address,address_detail as addressDetail, postcode, phone, crNumber, expiration, accountName, accountNumber FROM users WHERE id = ?';
  
    const [rows, field] = await pool.query(query,id);
    console.log('getInfo')
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getInfo error!',error);
    return callback(error, []);
  }
}


module.exports.getInfoOpen = async (id, callback) => {
  try{
    const query = 'SELECT email, name, address, address_detail as addressDetail, postcode, phone, crNumber, expiration FROM users WHERE id = ?';
  
    const [rows, field] = await pool.query(query,id);
    console.log('getInfoOpen')
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getInfoOpen error!',error);
    return callback(error, []);
  }
}

module.exports.updateInfo = async (id, data, callback) => {
  try{
    const query = `UPDATE users SET name = 
    '${data.name}', address = '${data.address}', address_detail = '${data.addressDetail}', postcode = '${data.postcode}', phone = '${data.phone}', crNumber = '${data.crNumber}', accountName = '${data.accountName}', accountNumber = '${data.accountNumber}' WHERE id = ?`;
  
    const [rows, field] = await pool.query(query,id);
    console.log('updateInfo')
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('updateInfo error!',error);
    return callback(error, []);
  }
}

module.exports.getListAdmin = async (data, callback) => {
  try{
    const {page} = data;
    const query = `SELECT id, email, crNumber, name, address, phone, created_date FROM users
		ORDER BY created_date DESC
    ${(page !== 'all' ? `LIMIT ${15*(page-1)}, 15` : '')}`;
  
    const [rows, field] = await pool.query(query);
    console.log('getListAdmin')
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getListAdmin error!',error);
    return callback(error, []);
  }
}

module.exports.getTotalAdmin = async (id, callback) => {
  try{
    const query = `SELECT count(*) as total FROM users`;
    const [rows, field] = await pool.query(query, id);
    console.log('getTotalAdmin')
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('emailCheck error!',error);
    return callback(error, []);
  }
}

module.exports.getListByFamily = async(id, callback) => {
  try{
    const query = `SELECT U.id, U.name, GROUP_CONCAT(PF.name) as family FROM en.users as U
    JOIN en.productFamily_user as PFU ON U.id = PFU.user_id
    JOIN en.productFamily as PF ON PF.id = PFU.family_id
    GROUP BY U.id;`;
    const [rows, field] = await pool.query(query, id);
    console.log('getListByFamily')
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getListByFamily error!',error);
    return callback(error, []);
  }
}

module.exports.getDetailAdmin = async (id, data, callback) => {
  try{
    const query = `SELECT id, email, crNumber, name, address, phone, created_date FROM users WHERE id= ?`;
    const [rows, field] = await pool.query(query, [data.id]);
    console.log('getDetailAdmin')
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getDetailAdmin error!',error);
    return callback(error, []);
  }
}

module.exports.getDetailAdmin1 = (id, data, callback) => {
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

module.exports.getProductFamilyAdmin = async (id, data, callback) => {
  try{
    const query = `SELECT PFU.id, PF.name FROM productFamily_user as PFU
		JOIN productFamily as PF ON PF.id = PFU.family_id
		WHERE PFU.user_id = ?`;
    const [rows, field] = await pool.query(query, [data.id]);
    console.log('getProductFamilyAdmin')
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getProductFamilyAdmin error!',error);
    return callback(error, []);
  }
}