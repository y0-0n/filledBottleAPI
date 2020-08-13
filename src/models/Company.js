'use strict';

const pool = require('../../config/dbpool').pool;

/**
 * 회원 가입
 * @param query
 * @param data
 * @param callback
 */
module.exports.createAdmin = async (data, callback) => {
  try{
    let {crNumber, name, address, addressDetail, postcode, phone, accountName, accountNumber} = data;
    console.warn(data)
    const query = 
    `INSERT INTO company SET crNumber = ?, name = ?, address = ?, address_detail = ?, postcode = ?, phone = ?, accountName = ?, accountNumber = ?`;
    const [rows, field] = await pool.query(
      query, [crNumber, name, address, addressDetail, postcode, phone, accountName, accountNumber]);    
    console.log('addCompany')
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('addCompany error',error)
  }
};


module.exports.getInfo = async (companyId, callback) => {
  try{
    const query = `SELECT name, address, address_detail as addressDetail, postcode, phone, crNumber, expiration, accountName, accountNumber FROM company WHERE id = ${companyId}`;
  
    const [rows, field] = await pool.query(query);
    console.log('getInfo');
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
    const query = 'SELECT name, address, address_detail as addressDetail, postcode, phone, crNumber FROM company WHERE id = ?';
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
    const query = `UPDATE company SET name = 
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
module.exports.getListAdmin = async ({page, perPage}, callback) => {
  try{
    const query = `SELECT id, name, phone, address, crNumber
    FROM company
    ${(page !== 'all' ? `LIMIT ${perPage*(page-1)}, ${perPage}` : '')}`;
  
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

module.exports.getTotalAdmin = async (callback) => {
  try{
    const query = `SELECT count(*) as total
    FROM company`;

    const [rows, field] = await pool.query(query);
    console.log('getTotalAdmin')
    //console.log('실행 sql emailcheck: ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getTotalAdmin error!',error);    
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
    FROM en.company as U
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

module.exports.getDetailAdmin = async (id, callback) => {
  try{
    const query = `SELECT name, address, address_detail as addressDetail, postcode, phone, crNumber, mall_visible, expiration FROM company WHERE id = ?`;
    const [rows, field] = await pool.query(query, [id]);
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