'use strict';

const pool = require('../../config/dbpool').pool;
const Product = require('./Product');

module.exports.getList = async (user, callback) => {
  try{
    const query = `SELECT * from plant
      WHERE user_id = ?
      AND \`set\`=1`;
    const [rows, field] = await pool.query(query, [user.id]);
    console.log('getList');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('getList error',error);
  }
}

module.exports.getList1 = (user, callback) => {
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

module.exports.searchPlant = async (user, data, callback) => {
	try{
    const {productFamily} = data;
    const query = `SELECT * from plant
      WHERE user_id = ?
      AND \`set\`=1`;
    const [rows, field] = await pool.query(query, [user.id]);
    console.log('searchPlant');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('searchPlant error',error);
  }
}

module.exports.searchPlant1 = (user, data, callback) => {
	const {productFamily} = data;
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
		const query = `SELECT P.* from plant as P
		JOIN familyInPlant as FP ON P.id = FP.plant_id
		WHERE user_id = ?
		AND FP.family_id = ${productFamily}
		GROUP BY P.id
		`;

    const exec = conn.query(query, [user.id], (err, result) => {
      conn.release();
      console.log('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}

module.exports.add = async (user, data, callback) => {
  try{
    const query_outer = `INSERT INTO plant
		(\`user_id\`, \`name\`) VALUES (?, '${data.plantName}');
		`;
    const [rows_outer, field_outer] = await pool.query(query_outer, [user.id]);
    console.log('add');    
    //console.log('실행 sql : ', exec.sql);
    Product.getList(user, async (err, msg) => {
      try{
        if(msg.length > 0) {
          let sql = '';
          msg.map((e,i) => {
            sql+=`INSERT INTO stock (\`product_id\`, \`quantity\`, \`plant_id\`) VALUES ('${e.id}', '${0}', '${rows_outer.insertId}'); `
          })
          //sql = `INSERT INTO stock (\`product_id\`, \`quantity\`) VALUES ('${product_id}', '${0}');`
          const [rows_inner, field_inner] = await pool.query(sql, [user.id]);
          console.log('add inner', sql);
          return callback(null, rows_inner);
        }
      }
      catch(error){
        console.log('add inner',error)
      }
    });
    return callback(null, rows_outer);
  }
  catch(error) {
    console.log('add error',error);
  }
}


module.exports.add1 = (user, data, callback) => {
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
    const query = `INSERT INTO plant
		(\`user_id\`, \`name\`) VALUES (?, '${data.plantName}');
		`;

    const exec = conn.query(query, [user.id], (err, result) => {
			conn.release();
			console.log('실행 sql : ', exec.sql);
			// Product.getList(user, (err, msg) => {
			// 	if(err) throw err;
			// 	if(msg.length > 0) {
			// 		let sql = '';
			// 		msg.map((e,i) => {
			// 			sql+=`INSERT INTO stock (\`product_id\`, \`quantity\`, \`plant_id\`) VALUES ('${e.id}', '${0}', '${result.insertId}'); `
			// 		})
			// 		//sql = `INSERT INTO stock (\`product_id\`, \`quantity\`) VALUES ('${product_id}', '${0}');`
			// 		conn.query(sql, function(err_, rows_) {
			// 			conn.release();
			// 			console.log(sql);
			// 			if(err_) throw err_;
			// 			console.log('stock '+rows_);
			// 		});
			// 	}
			// });
      return callback(err, result);
    });
	})
}

module.exports.deactivate = async (user, data, callback) => {
  try{
    const {id} = data;
    const query = `UPDATE plant
      SET \`set\` = 0
      WHERE user_id = ?
      AND id = ?`;
    const [rows, field] = await pool.query(query, [user.id,id]);
    console.log('deactivate');    
    //console.log('실행 sql : ', exec.sql);
    return callback(null, rows);
  }
  catch(error) {
    console.log('deactivate error',error);
  }
}

module.exports.deactivate1 = (user, data, callback) => {
	const {id} = data;
  pool.getConnection(function(err, conn) {
    if(err) {
      conn.release();
      throw err;
    }
		const query = `UPDATE plant
		SET \`set\` = 0
		WHERE user_id = ?
		AND id = ?`;

    const exec = conn.query(query, [user.id, id], (err, result) => {
      conn.release();
      console.warn('실행 sql : ', exec.sql);

      return callback(err, result);
    });
  })
}
