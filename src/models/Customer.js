'use strict';

const pool = require('../../config/dbpool').pool;
const Product = require('./Product');

module.exports.getOrder = async (user, data, callback) => {
  try{
    const query = 
    `SELECT P.\`name\`, SUM(OP.quantity) as quantity, SUM(OP.price) as sum FROM customer AS C
			JOIN \`order\` AS O ON C.id = O.customer_id
			JOIN order_product AS OP ON OP.order_id = O.id
			JOIN product AS P ON OP.product_id = P.id
			WHERE C.company_id = ?
			AND O.customer_id = ${data.customer}
			GROUP BY P.id
		`;
    const [rows, field] = await pool.query(query, [user.company_id]);
    console.log('getOrder');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getOrder error',error);
  }
}

module.exports.total = async (user, data, callback) => {
  let {keyword} = data;
  const name = keyword;
  try{
    const query = 
      `SELECT count(*) as total
      FROM customer as A JOIN company as B ON A.company_id = B.id
      WHERE \`set\`=1
      AND B.id = '${user.company_id}'
      ${name !== '' ? `AND A.name like '%${name}%'` : ``}`
    const [rows, field] = await pool.query(query);
    console.log('total');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('total error', error);
  }
}

module.exports.totalUnset = async (user, data, callback) => {
  let {keyword} = data;
  const name = keyword;
  try{
    const query = 
      `SELECT count(*) as total
      FROM customer as A JOIN company as B ON A.company_id = B.id
      WHERE \`set\`=0
      AND B.id='${user.company_id}'
      ${(name !== '' ? `AND A.name = '${name}'`: '')}`
    const [rows, field] = await pool.query(query);
    console.log('totalUnset');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('totalUnset error', error);
  }
}

module.exports.list = async (user, data, callback) => {
  let {page, keyword} = data;
  const name = keyword;
  try{
    const query = 
      `SELECT A.id as id, A.\`name\` as \`name\`, A.telephone as telephone, A.cellphone as cellphone, A.\`set\` as \`set\`, A.address as address, A.address_detail as addressDetail, A.postcode as postcode
      FROM customer as A JOIN company as B ON A.company_id = B.id
      WHERE \`set\`=1
      AND B.id = '${user.company_id}'
      ${name !== '' ? `AND A.name LIKE '%${name}%'` : ``}
      ${(page !== 'all' ? `LIMIT ${15*(page-1)}, 15` : '')}`
    const [rows, field] = await pool.query(query);
    console.log('list');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('list error', error);
  }
}

module.exports.listUnset = async (user, data, callback) => {
  let {page, keyword} = data;
  const name = keyword;
  try{
    const query = 
      `SELECT A.id as id, A.\`name\` as \`name\`, A.telephone as telephone, A.cellphone as cellphone, A.\`set\` as \`set\`, A.address as address
      FROM customer as A JOIN company as B ON A.company_id = B.id
      WHERE \`set\`=0
      AND B.id = '${user.company_id}'
      ${name !== '' ? `AND A.name = '${name}'` : ``}
      ${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}`
    const [rows, field] = await pool.query(query);
    console.log('listUnset');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('listUnset error', error);
  }
}

module.exports.getCustomerOrder = async (params, callback) => {
  let id = params.id; // 거래처 이름
  try{
    const query = `SELECT * from customer WHERE id = ${id}`
    const [rows, field] = await pool.query(query);
    console.log('getCustomerOrder');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('getCustomerOrder error', error);
    return callback(error,[]);
  }
}

module.exports.addCustomer = async (user, data, callback) => {
  let {name, delegate, telephone, cellphone, set, postcode, address, addressDetail, crNumber} = data;
  try{
    const query = 
    `INSERT INTO customer (\`name\`, \`telephone\`, \`cellphone\`, \`set\`, \`address\`, \`address_detail\`, \`postcode\`, \`company_id\`, \`crNumber\`)
    VALUES ('${name}', '${telephone}', '${cellphone}', '${1}',  '${address}', '${addressDetail}', '${postcode}', '${user.company_id}', '${crNumber}')`
    const [rows, field] = await pool.query(query);
    console.log('addCustomer');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('addCustomer error', error);
  }
}

module.exports.modifyCustomer = async (params, data, callback) => {
  let {name, telephone, cellphone, address, addressDetail, postcode, crNumber} = data;
  try{
    const query = 
      `UPDATE customer SET \`name\`='${name}', \`telephone\`='${telephone}', \`cellphone\`='${cellphone}', \`address\`='${address}', \`address_detail\`='${addressDetail}', \`postcode\`='${postcode}', \`crNumber\`='${crNumber}'
      WHERE \`id\`="${params.id}";`
    const [rows, field] = await pool.query(query);
    console.log('modifyCustomer');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('modifyCustomer error', error);
  }
}

module.exports.activateCustomer = async (data, callback) => {
  try{
    const query = 
      "UPDATE customer SET \`set\`=1 WHERE `id`="+data.id+";"
    const [rows, field] = await pool.query(query);
    console.log('activateCustomer');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('activateCustomer error', error);
  }
}

module.exports.deactivateCustomer = async (data, callback) => {
  try{
    const query = 
      "UPDATE customer SET \`set\`=0 WHERE `id`="+data.id+";"
    const [rows, field] = await pool.query(query);
    console.log('deactivateCustomer');    
    return callback(null, rows);
  }
  catch(error) {
    console.log('deactivateCustomer error', error);
  }
}