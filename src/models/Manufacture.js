'use strict';

const pool = require('../../config/dbpool').pool;

module.exports.addManufacture = (user, data, callback) => {
  const title = (`${data.sProduct2[0].name}${data.sProduct2.length === 1 ? '' : `외 ${data.sProduct2.length-1}건`}`)
  let total = 0;
  data.sProduct2.map((e, i) => {
    total += parseInt(e.quantity);
  })
  pool.getConnection(function(err, conn) {
    if (err) {
      conn.release();
      throw err;
    }
    const query = 'INSERT INTO manufacture SET title = ?, user_id = ?, total = ?';
    const exec = conn.query(query, [title, user.id, total], (err, result) => {
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

module.exports.getTotal = (user, name, first_date, last_date, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `SELECT count(*) as total FROM manufacture
                  WHERE user_id = ?
                  AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
                  ${name !== '' ? `AND title = '${name}'` : ``}`;

    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}

module.exports.getList = (user, page, name, first_date, last_date, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `SELECT * FROM manufacture
                  WHERE user_id = ?
                  ${name !== '' ? `AND title = '${name}'` : ``}
                  AND DATE(\`date\`) BETWEEN '${first_date}' AND '${last_date}'
                  ORDER BY date DESC
                  ${(page !== 'all' ? `LIMIT ${5*(page-1)}, 5` : '')}
                  `;

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
    const query = `SELECT P.id as product_id, S.quantity, P.name, P.grade, P.weight, P.price_shipping, S.change, PL.name as plantName
    FROM manufacture AS M JOIN stock_manufacture AS SM ON M.id = SM.manufacture_id
		JOIN stock AS S ON S.id = SM.stock_id
		JOIN plant as PL ON PL.id = S.plant_id
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
    const query = `SELECT P.id as product_id, S.quantity, P.name, P.grade, P.weight, P.price_shipping, S.change, PL.name as plantName
    FROM manufacture AS M JOIN stock_manufacture AS SM ON M.id = SM.manufacture_id
		JOIN stock AS S ON S.id = SM.stock_id
		JOIN plant as PL ON PL.id = S.plant_id
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

module.exports.cancel = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
		const query = `UPDATE \`manufacture\`
									SET \`set\` = '0'
									WHERE \`user_id\` = ?
									AND \`id\` = ?`;
    const exec = conn.query(query, [user.id, data.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}
