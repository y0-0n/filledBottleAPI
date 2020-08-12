'use strict';

const pool = require('../../config/dbpool').pool;

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