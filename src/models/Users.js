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


/**
 * 이메일 중복 체크
 * @param email
 * @param callback
 */
module.exports.emailCheck = async (email, callback) => {
  try{
    const query = 'SELECT count(*) as count FROM users_company WHERE email = ?';
  
    const [rows, field] = await pool.query(query,email);
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows[0].count);
  }
  catch(error) {
    console.log('emailCheck error!',error);
    return callback(error, []);
  }
  
};

/**
 * 이메일 중복 체크
 * @param email
 * @param callback
 */
module.exports.getAuthInfo = async (email, callback) => {
  try{
    const query = `SELECT password, salt, U.id as user_id, role, C.id as company_id
    FROM users_company as U JOIN company as C ON U.company_id = C.id
    WHERE email = ?`;
  
    const [rows, field] = await pool.query(query,email);
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getAuthInfo error!',error);
    return callback(error, []);
  }
};



module.exports.getInfo = async (user, callback) => {
  try{
    const query = `SELECT email, name
    FROM users_company WHERE id = ${user.user_id}`;

    const [rows, field] = await pool.query(query);
    console.log('getInfo');
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
    const query = `SELECT id, email, name, createAt, phone FROM users_company
		ORDER BY createAt DESC
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
    const query = `SELECT count(*) as total FROM users_company`;
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
    const query = `SELECT U.id, U.name,
    (SELECT GROUP_CONCAT(DISTINCT PF.name) FROM product AS P
    JOIN productFamily as PF ON P.family = PF.id
    WHERE user_id = U.id
    ) as family
    FROM en.users as U
    WHERE U.mall_visible = 1;`;
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