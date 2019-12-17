'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.addManufacture = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = 'INSERT INTO manufacture SET title = ?, user_id = ?';
    const exec = conn.query(query, ['Test', user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};

module.exports.addManufactureStock = (stock_id, manufacture_id, flag, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = 'INSERT INTO stock_manufacture SET stock_id = ?, manufacture_id = ?, flag = ?';
    const exec = conn.query(query, [stock_id, manufacture_id, flag], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  });
};

module.exports.getList = (user, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `SELECT * FROM manufacture
    WHERE user_id = ?`;
    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}

module.exports.getDetail = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `SELECT * FROM manufacture as M
    WHERE user_id = ?
    AND id = ?`;
    const exec = conn.query(query, [user.id, data.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}

module.exports.getStockFromManufactureByProduce = (id, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT S.quantity, P.name, P.grade, P.weight, P.price_shipping, S.change
    FROM manufacture AS M JOIN stock_manufacture AS SM ON M.id = SM.manufacture_id
    JOIN stock AS S ON S.id = SM.stock_id
    JOIN product AS P ON P.id = S.product_id
    WHERE SM.\`flag\` = 'produce'
    AND M.id = ?`;
  
    const exec = conn.query(query, [id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      
      return callback(err, result);
    });
  });
}

module.exports.getStockFromManufactureByConsume = (id, callback) => {
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = `SELECT S.quantity, P.name, P.grade, P.weight, P.price_shipping, S.change
    FROM manufacture AS M JOIN stock_manufacture AS SM ON M.id = SM.manufacture_id
    JOIN stock AS S ON S.id = SM.stock_id
    JOIN product AS P ON P.id = S.product_id
    WHERE SM.\`flag\` = 'consume'
    AND M.id = ?`;
  
    const exec = conn.query(query, [id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);
      
      return callback(err, result);
    });
  });
}